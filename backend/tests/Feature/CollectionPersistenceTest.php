<?php

namespace Tests\Feature;

use App\Enums\SectionKey;
use App\Models\GalleryItem;
use App\Models\LoveEntry;
use App\Models\MediaAsset;
use App\Models\Section;
use App\Models\StoryMemory;
use App\Models\TimelineMoment;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CollectionPersistenceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->assertSame('sqlite', DB::connection()->getDriverName());
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
        foreach (['story_memories', 'gallery_items', 'love_entries', 'timeline_moments'] as $table) {
            $this->assertTrue(Schema::hasTable($table), 'A3 collection migrations must exist.');
        }
        $this->seed();
    }

    public static function collections(): array
    {
        return [
            'story' => [StoryMemory::class, SectionKey::HorizontalStory],
            'gallery' => [GalleryItem::class, SectionKey::Gallery],
            'love' => [LoveEntry::class, SectionKey::ThingsILove],
            'timeline' => [TimelineMoment::class, SectionKey::Timeline],
        ];
    }

    private function media(): MediaAsset
    {
        return MediaAsset::create([
            'original_path' => 'originals/synthetic.jpg', 'original_mime_type' => 'image/jpeg', 'original_byte_size' => 100,
        ]);
    }

    private function values(string $model, SectionKey $key): array
    {
        return [
            'section_id' => Section::where('key', $key)->sole()->id,
            ...($model === GalleryItem::class ? ['media_asset_id' => $this->media()->id] : []),
        ];
    }

    #[DataProvider('collections')]
    public function test_collection_defaults_relationships_and_owner_position(string $model, SectionKey $key): void
    {
        $entry = $model::create($this->values($model, $key))->fresh();
        $this->assertSame($key, $entry->section->key);
        $this->assertSame(0, $entry->position);
        $this->assertSame(1, $entry->version);
        $entry->update(['position' => 7, 'version' => 3]);
        $this->assertSame(7, $entry->fresh()->position);
        $this->assertSame(3, $entry->fresh()->version);
        if ($model === LoveEntry::class) {
            $this->assertSame('', $entry->statement);
            $this->assertNull($entry->supporting_text);
        } else {
            $this->assertSame(0.5, $entry->focal_x);
            $this->assertSame(0.5, $entry->focal_y);
            $this->assertNull($entry->date);
            if ($model !== GalleryItem::class) {
                $this->assertSame(['blocks' => []], $entry->message);
                $this->assertNull($entry->title);
                $this->assertNull($entry->mediaAsset);
            }
        }
    }

    public function test_story_and_timeline_preserve_bounded_rich_documents_dates_and_media(): void
    {
        $document = ['blocks' => [
            ['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => []], ['type' => 'line_break']]],
            ['type' => 'blockquote', 'children' => [['type' => 'text', 'text' => str_repeat('Synthetic text ', 500), 'marks' => ['bold', 'italic']]]],
        ]];
        $media = $this->media();
        foreach ([[StoryMemory::class, SectionKey::HorizontalStory], [TimelineMoment::class, SectionKey::Timeline]] as [$model, $key]) {
            $entry = $model::create($this->values($model, $key) + [
                'title' => 'Memory title', 'date' => '2000-02-29', 'message' => $document,
                'media_asset_id' => $media->id, 'focal_x' => 0, 'focal_y' => 1,
            ])->fresh();
            $this->assertSame($document, $entry->message);
            $this->assertSame('Memory title', $entry->title);
            $this->assertSame('2000-02-29', $entry->toArray()['date']);
            $this->assertTrue($entry->mediaAsset->is($media));
            $this->assertSame(0.0, $entry->focal_x);
            $this->assertSame(1.0, $entry->focal_y);
        }
    }

    public function test_gallery_text_focal_metadata_and_love_text_round_trip(): void
    {
        $gallery = GalleryItem::create($this->values(GalleryItem::class, SectionKey::Gallery) + [
            'alt_text' => '', 'caption' => str_repeat('Test caption ', 500), 'date' => '2024-02-29', 'focal_x' => 0.1234, 'focal_y' => 0.8765,
        ])->fresh();
        $this->assertSame('', $gallery->alt_text);
        $this->assertSame(str_repeat('Test caption ', 500), $gallery->caption);
        $this->assertSame('2024-02-29', $gallery->date);
        $this->assertSame(0.1234, $gallery->focal_x);
        $this->assertSame(0.8765, $gallery->focal_y);
        $this->assertSame($gallery->media_asset_id, $gallery->mediaAsset->id);
        $love = LoveEntry::create($this->values(LoveEntry::class, SectionKey::ThingsILove) + [
            'statement' => '', 'supporting_text' => str_repeat('Sample statement ', 500),
        ])->fresh();
        $this->assertSame('', $love->statement);
        $this->assertSame(str_repeat('Sample statement ', 500), $love->supporting_text);
    }

    #[DataProvider('collections')]
    public function test_collection_order_is_position_then_id_with_duplicates_allowed(string $model, SectionKey $key): void
    {
        $values = $this->values($model, $key);
        $first = $model::create($values + ['position' => 9]);
        $second = $model::create($values + ['position' => 2]);
        $third = $model::create($values + ['position' => 2]);
        $this->assertSame([$second->id, $third->id, $first->id], $model::all()->modelKeys());
    }

    public function test_timeline_dates_never_override_manual_order(): void
    {
        $values = $this->values(TimelineMoment::class, SectionKey::Timeline);
        $first = TimelineMoment::create($values + ['position' => 0, 'date' => '2025-01-01']);
        $second = TimelineMoment::create($values + ['position' => 1, 'date' => '2020-01-01']);
        $third = TimelineMoment::create($values + ['position' => 2, 'date' => null]);
        $this->assertSame([$first->id, $second->id, $third->id], TimelineMoment::all()->modelKeys());
        $this->assertSame([0, 1, 2], TimelineMoment::all()->pluck('position')->all());
    }

    #[DataProvider('collections')]
    public function test_wrong_section_and_invalid_common_values_fail_normal_creates_and_updates(string $model, SectionKey $key): void
    {
        $values = $this->values($model, $key);
        $entry = $model::create($values);
        foreach ([
            ['section_id' => Section::where('key', SectionKey::Hero)->sole()->id],
            ['section_id' => 9999], ['position' => -1], ['position' => 1.5], ['version' => 0], ['version' => 1.5],
        ] as $invalid) {
            foreach ([new $model($values), $entry->fresh()] as $candidate) {
                try {
                    $candidate->fill($invalid)->save();
                    $this->fail('Invalid collection values must be rejected.');
                } catch (ValidationException $exception) {
                    $this->assertArrayHasKey(array_key_first($invalid), $exception->errors());
                }
            }
        }
        $this->assertSame($values['section_id'], $entry->fresh()->section_id);
        $this->assertDatabaseCount($entry->getTable(), 1);
    }

    public static function invalidContent(): array
    {
        $cases = [];
        foreach ([[StoryMemory::class, SectionKey::HorizontalStory], [GalleryItem::class, SectionKey::Gallery], [TimelineMoment::class, SectionKey::Timeline]] as [$model, $key]) {
            foreach ([['date' => ''], ['date' => '2025-02-29'], ['date' => '2025-1-1'], ['date' => '2025-01-01T00:00:00Z'], ['focal_x' => -0.1], ['focal_y' => 1.1], ['focal_x' => '']] as $invalid) {
                $cases[] = [$model, $key, $invalid, array_key_first($invalid)];
            }
            if ($model !== GalleryItem::class) {
                foreach ([null, '', ['blocks' => ''], ['blocks' => [], 'html' => ''], ['blocks' => [['type' => 'heading', 'children' => []]]], ['blocks' => [['type' => 'paragraph', 'children' => [['type' => 'text', 'text' => '', 'marks' => ['color']]]]]]] as $message) {
                    $cases[] = [$model, $key, ['message' => $message], 'message'];
                }
                $cases[] = [$model, $key, ['title' => []], 'title'];
            }
        }

        return [
            ...$cases,
            [GalleryItem::class, SectionKey::Gallery, ['media_asset_id' => null], 'media_asset_id'],
            [GalleryItem::class, SectionKey::Gallery, ['alt_text' => null], 'alt_text'],
            [GalleryItem::class, SectionKey::Gallery, ['caption' => []], 'caption'],
            [LoveEntry::class, SectionKey::ThingsILove, ['statement' => null], 'statement'],
            [LoveEntry::class, SectionKey::ThingsILove, ['supporting_text' => []], 'supporting_text'],
        ];
    }

    #[DataProvider('invalidContent')]
    public function test_collection_content_boundaries_are_rejected(string $model, SectionKey $key, array $invalid, string $field): void
    {
        try {
            $model::create(array_replace($this->values($model, $key), $invalid));
            $this->fail('Invalid content must be rejected.');
        } catch (ValidationException $exception) {
            $this->assertTrue(collect(array_keys($exception->errors()))->contains(fn (string $error) => $error === $field || str_starts_with($error, $field.'.')));
        }
        $this->assertDatabaseCount((new $model)->getTable(), 0);
    }

    #[DataProvider('collections')]
    public function test_soft_deletion_preserves_media_and_section_and_allows_recovery(string $model, SectionKey $key): void
    {
        Storage::shouldReceive('disk')->never();
        Storage::shouldReceive('delete')->never();
        $values = $this->values($model, $key);
        if ($model !== LoveEntry::class && $model !== GalleryItem::class) {
            $values['media_asset_id'] = $this->media()->id;
        }
        $entry = $model::create($values);
        $entry->delete();
        $this->assertNull($model::find($entry->id));
        $this->assertSoftDeleted($entry);
        $this->assertTrue(Section::whereKey($values['section_id'])->exists());
        if ($model !== LoveEntry::class) {
            $media = MediaAsset::findOrFail($values['media_asset_id']);
            $this->assertNull($media->deleted_at);
            $entry->restore();
            $media->delete();
            $this->assertNotNull($model::find($entry->id));
            $this->assertSame($media->id, $entry->fresh()->media_asset_id);
            $this->assertTrue($entry->fresh()->mediaAsset->trashed());
        } else {
            $entry->restore();
        }
        $this->assertSame(1, $entry->fresh()->version);
    }

    #[DataProvider('collections')]
    public function test_section_hard_delete_is_restricted_with_content(string $model, SectionKey $key): void
    {
        $entry = $model::create($this->values($model, $key));
        $this->expectException(QueryException::class);
        $entry->section->delete();
    }

    public static function imageCollections(): array
    {
        return array_filter(self::collections(), fn (array $case) => $case[0] !== LoveEntry::class);
    }

    #[DataProvider('imageCollections')]
    public function test_media_hard_delete_is_restricted_even_for_trashed_content(string $model, SectionKey $key): void
    {
        $media = $this->media();
        $entry = $model::create(array_replace($this->values($model, $key), ['media_asset_id' => $media->id]));
        $entry->delete();
        $this->expectException(QueryException::class);
        $media->forceDelete();
    }

    #[DataProvider('imageCollections')]
    public function test_invalid_media_foreign_key_fails(string $model, SectionKey $key): void
    {
        $this->expectException(QueryException::class);
        $model::create(array_replace($this->values($model, $key), ['media_asset_id' => '01ARZ3NDEKTSV4RRFFQ69G5FAV']));
    }

    public function test_all_a3_migrations_reverse_without_removing_a1_a2_tables(): void
    {
        $paths = glob(database_path('migrations/2026_10_08_00000[3-7]*.php'));
        $this->assertCount(5, $paths);
        foreach (array_reverse($paths) as $path) {
            (require $path)->down();
        }
        foreach (['media_assets', 'story_memories', 'gallery_items', 'love_entries', 'timeline_moments'] as $table) {
            $this->assertFalse(Schema::hasTable($table));
        }
        $this->assertDatabaseCount('sections', 9);
        $this->assertDatabaseCount('site_settings', 1);
        foreach ($paths as $path) {
            (require $path)->up();
        }
        $this->seed();
        $this->assertDatabaseCount('sections', 9);
        $this->assertDatabaseCount('media_assets', 0);
    }
}
