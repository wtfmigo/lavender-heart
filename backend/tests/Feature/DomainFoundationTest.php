<?php

namespace Tests\Feature;

use App\Enums\SectionKey;
use App\Enums\ThemePreset;
use App\Models\Section;
use App\Models\SiteSettings;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class DomainFoundationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->assertTrue(Schema::hasTable('site_settings'), 'A2 settings migration must exist.');
        $this->assertTrue(Schema::hasTable('sections'), 'A2 sections migration must exist.');
        $this->seed();
    }

    public function test_fresh_seed_has_only_empty_technical_defaults(): void
    {
        $this->assertDatabaseCount('site_settings', 1);
        $this->assertDatabaseCount('sections', 9);
        $this->assertDatabaseCount('users', 0);
        $settings = SiteSettings::sole();
        $this->assertSame(1, $settings->id);
        $this->assertSame(ThemePreset::LavenderMist, $settings->theme_preset);
        $this->assertSame(1, $settings->version);
        $this->assertFalse($settings->relationship_counter_visible);
        $this->assertNull($settings->birthday_date);
        $this->assertNull($settings->relationship_start_date);
        $this->assertNull($settings->owner_user_id);
        foreach (['recipient_name', 'nickname', 'closing_signature'] as $field) {
            $this->assertSame('', $settings->$field);
        }
        foreach (Section::all() as $section) {
            $this->assertTrue($section->visible);
            $this->assertSame(1, $section->version);
            $this->assertSame(match ($section->key) {
                SectionKey::Hero => ['title' => '', 'subtitle' => ''],
                SectionKey::Intro => ['message' => ['blocks' => []], 'supportingText' => ''],
                SectionKey::FullWidthMemory => ['caption' => '', 'date' => null],
                SectionKey::BirthdayLetter => ['heading' => '', 'opening' => '', 'body' => ['blocks' => []], 'signature' => '', 'date' => null],
                SectionKey::FinalClosing => ['message' => ['blocks' => []], 'date' => null],
                default => ['heading' => ''],
            }, $section->content);
        }
        foreach (['timezone', 'passcode', 'audio', 'analytics'] as $field) {
            $this->assertFalse(Schema::hasColumn('site_settings', $field));
        }
        $this->assertFalse(Schema::hasColumn('sections', 'sort_order'));
        foreach (['story_memories', 'gallery_items', 'love_entries', 'timeline_moments', 'media_assets', 'content_revisions', 'revision_media'] as $table) {
            $this->assertFalse(Schema::hasTable($table));
        }
    }

    public function test_settings_singleton_identity_is_protected_on_create_and_update(): void
    {
        foreach ([new SiteSettings, SiteSettings::sole()] as $settings) {
            $settings->forceFill(['id' => 2]);
            try {
                $settings->save();
                $this->fail('A second settings identity must be rejected.');
            } catch (ValidationException $exception) {
                $this->assertArrayHasKey('id', $exception->errors());
            }
        }
        $this->assertDatabaseCount('site_settings', 1);
        $this->assertDatabaseHas('site_settings', ['id' => 1]);
    }

    public function test_settings_primary_key_prevents_a_second_default_row(): void
    {
        $this->expectException(QueryException::class);
        SiteSettings::create();
    }

    public function test_dates_persist_and_serialize_as_date_only_without_timezone(): void
    {
        $settings = SiteSettings::sole();
        $settings->update(['birthday_date' => '2000-02-29', 'relationship_start_date' => '2025-12-31']);
        $settings->refresh();
        $json = json_decode($settings->toJson(), true);
        $this->assertSame('2000-02-29', $settings->birthday_date);
        $this->assertSame('2025-12-31', $json['relationship_start_date']);
        $this->assertSame('2000-02-29', DB::table('site_settings')->value('birthday_date'));
        $section = Section::where('key', SectionKey::FullWidthMemory)->sole();
        $section->update(['content' => ['caption' => '', 'date' => '2000-02-29']]);
        $this->assertSame('2000-02-29', $section->fresh()->toArray()['content']['date']);
    }

    #[DataProvider('invalidSettings')]
    public function test_settings_reject_invalid_domain_values(array $values, string $field): void
    {
        $this->expectException(ValidationException::class);
        try {
            SiteSettings::sole()->update($values);
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey($field, $exception->errors());
            throw $exception;
        }
    }

    public static function invalidSettings(): array
    {
        return [
            'invalid date' => [['birthday_date' => '2025-02-29'], 'birthday_date'],
            'timestamp date' => [['relationship_start_date' => '2025-01-01T00:00:00Z'], 'relationship_start_date'],
            'noncanonical date' => [['birthday_date' => '2025-1-1'], 'birthday_date'],
            'empty birthday' => [['birthday_date' => ''], 'birthday_date'],
            'empty relationship date' => [['relationship_start_date' => ''], 'relationship_start_date'],
            'zero version' => [['version' => 0], 'version'],
            'fractional version' => [['version' => 1.5], 'version'],
        ];
    }

    public function test_theme_cast_rejects_unknown_presets(): void
    {
        $this->expectException(\ValueError::class);
        SiteSettings::sole()->update(['theme_preset' => 'custom']);
    }

    public function test_owner_reference_uses_existing_user_and_nulls_on_deletion(): void
    {
        $owner = User::factory()->create();
        $settings = SiteSettings::sole();
        $settings->update(['owner_user_id' => $owner->id]);
        $this->assertTrue($settings->owner->is($owner));
        $owner->delete();
        $this->assertNull($settings->fresh()->owner_user_id);
    }

    public function test_section_keys_are_unique_and_order_is_canonical_after_restore(): void
    {
        Section::where('key', SectionKey::Intro)->delete();
        $this->seed();
        $this->assertSame(SectionKey::cases(), Section::all()->pluck('key')->all());
        $this->expectException(QueryException::class);
        $hero = Section::where('key', SectionKey::Hero)->sole();
        Section::create(['key' => SectionKey::Hero, 'content' => $hero->content]);
    }

    public function test_unknown_section_key_is_rejected(): void
    {
        $this->expectException(\ValueError::class);
        Section::create(['key' => 'custom', 'content' => []]);
    }

    public function test_missing_section_key_has_a_validation_error(): void
    {
        $this->expectException(ValidationException::class);
        Section::create(['content' => ['heading' => '']]);
    }

    #[DataProvider('requiredSections')]
    public function test_required_sections_cannot_be_hidden(string $key): void
    {
        $section = Section::where('key', $key)->sole();
        try {
            $section->update(['visible' => false]);
            $this->fail('Required section must remain visible.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('visible', $exception->errors());
        }
        $this->assertTrue($section->fresh()->visible);
        $section->delete();
        $this->expectException(ValidationException::class);
        Section::create(['key' => $key, 'visible' => false, 'content' => $section->content]);
    }

    public static function requiredSections(): array
    {
        return [['hero'], ['final_closing']];
    }

    public function test_all_seven_middle_sections_can_toggle_visibility(): void
    {
        $middle = Section::all()->reject(fn (Section $section) => $section->key->isRequired());
        $this->assertCount(7, $middle);
        foreach ($middle as $section) {
            $section->update(['visible' => false]);
            $this->assertFalse($section->fresh()->visible);
            $section->update(['visible' => true]);
            $this->assertTrue($section->fresh()->visible);
        }
    }

    public function test_section_version_must_be_a_positive_integer(): void
    {
        $this->expectException(ValidationException::class);
        Section::where('key', SectionKey::Hero)->sole()->update(['version' => 0]);
    }

    public function test_seed_preserves_edited_values_versions_and_restores_missing_defaults(): void
    {
        SiteSettings::sole()->update([
            'recipient_name' => 'Synthetic recipient', 'nickname' => 'Synthetic nickname',
            'closing_signature' => str_repeat('Synthetic signature ', 100),
            'theme_preset' => ThemePreset::PearlLavender, 'birthday_date' => '2000-02-29',
            'relationship_start_date' => '2025-01-01', 'relationship_counter_visible' => true, 'version' => 7,
        ]);
        Section::where('key', SectionKey::Intro)->sole()->update([
            'visible' => false, 'content' => ['message' => ['blocks' => []], 'supportingText' => str_repeat('Synthetic text ', 500)], 'version' => 4,
        ]);
        $beforeSettings = SiteSettings::sole()->getAttributes();
        $beforeSections = Section::all()->map->getAttributes()->all();
        $this->seed();
        $this->seed();
        $this->assertSame($beforeSettings, SiteSettings::sole()->getAttributes());
        $this->assertSame($beforeSections, Section::all()->map->getAttributes()->all());
        Section::where('key', SectionKey::Gallery)->delete();
        $this->seed();
        $this->assertDatabaseCount('sections', 9);
        $this->assertSame(4, Section::where('key', SectionKey::Intro)->sole()->version);
        $this->assertSame(['heading' => ''], Section::where('key', SectionKey::Gallery)->sole()->content);
        $this->assertDatabaseCount('users', 0);
    }

    public function test_valid_limited_rich_text_and_long_copy_round_trip(): void
    {
        $document = ['blocks' => [
            ['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => ['bold', 'italic']], ['type' => 'text', 'text' => '', 'marks' => []], ['type' => 'line_break']]],
            ['type' => 'blockquote', 'children' => [['type' => 'text', 'text' => str_repeat('Synthetic text ', 500)]]],
        ]];
        $letter = Section::where('key', SectionKey::BirthdayLetter)->sole();
        $content = ['heading' => '', 'opening' => '', 'body' => $document, 'signature' => '', 'date' => null];
        $letter->update(['content' => $content]);
        $this->assertSame($content, $letter->fresh()->content);
    }

    #[DataProvider('invalidContent')]
    public function test_section_content_rejects_structures_outside_finite_contract(string $key, array $content): void
    {
        $this->expectException(ValidationException::class);
        Section::where('key', $key)->sole()->update(['content' => $content]);
    }

    public static function invalidContent(): array
    {
        $doc = fn (array $block) => ['message' => ['blocks' => [$block]], 'supportingText' => ''];

        return [
            'unknown singleton field' => ['hero', ['title' => '', 'subtitle' => '', 'layout' => 'custom']],
            'missing singleton field' => ['hero', ['title' => '']],
            'wrong singleton type' => ['gallery', ['heading' => 42]],
            'null text' => ['hero', ['title' => null, 'subtitle' => '']],
            'invalid date' => ['full_width_memory', ['caption' => '', 'date' => '2025-02-29']],
            'timestamp' => ['full_width_memory', ['caption' => '', 'date' => '2025-01-01T00:00:00Z']],
            'empty date' => ['full_width_memory', ['caption' => '', 'date' => '']],
            'empty document' => ['intro', ['message' => '', 'supportingText' => '']],
            'empty blocks' => ['intro', ['message' => ['blocks' => ''], 'supportingText' => '']],
            'empty children' => ['intro', $doc(['type' => 'paragraph', 'children' => ''])],
            'empty marks' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => '']]])],
            'blank mark' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => ['']]]])],
            'whitespace mark' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => ['   ']]]])],
            'null marks' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => null]]])],
            'object marks' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => ['named' => 'bold']]]])],
            'null blocks' => ['intro', ['message' => ['blocks' => null], 'supportingText' => '']],
            'null children' => ['intro', $doc(['type' => 'paragraph', 'children' => null])],
            'arbitrary document keys' => ['intro', ['message' => ['blocks' => [], 'html' => '<p>synthetic</p>'], 'supportingText' => '']],
            'object blocks' => ['intro', ['message' => ['blocks' => ['named' => ['type' => 'paragraph', 'children' => []]]], 'supportingText' => '']],
            'unknown block' => ['intro', $doc(['type' => 'heading', 'children' => []])],
            'block layout' => ['intro', $doc(['type' => 'paragraph', 'children' => [], 'style' => 'custom'])],
            'unknown inline' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'link', 'text' => 'Synthetic']]])],
            'unsupported mark' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => ['color']]]])],
            'run properties' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'style' => 'custom']]])],
            'linebreak properties' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'line_break', 'text' => '']]])],
            'missing run text' => ['intro', $doc(['type' => 'paragraph', 'children' => [['type' => 'text']]])],
        ];
    }

    public function test_new_migrations_are_reversible_without_dropping_existing_tables(): void
    {
        $this->assertSame('sqlite', DB::connection()->getDriverName());
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
        $paths = glob(database_path('migrations/*create_site_settings_table.php'));
        $paths = array_merge($paths, glob(database_path('migrations/*create_sections_table.php')));
        $this->assertCount(2, $paths);
        foreach (array_reverse($paths) as $path) {
            (require $path)->down();
        }
        $this->assertFalse(Schema::hasTable('sections'));
        $this->assertFalse(Schema::hasTable('site_settings'));
        $this->assertTrue(Schema::hasTable('users'));
        foreach ($paths as $path) {
            (require $path)->up();
        }
        $this->seed();
        $this->assertDatabaseCount('sections', 9);
        $this->assertDatabaseCount('site_settings', 1);
    }
}
