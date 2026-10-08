<?php

namespace Tests\Feature;

use App\Models\GalleryItem;
use App\Models\MediaAsset;
use App\Models\Section;
use App\Models\SiteSettings;
use App\Models\StoryMemory;
use App\Services\PublicExperience;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class PublicExperienceTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_failures_do_not_expose_private_exception_details(): void
    {
        $this->mock(PublicExperience::class, function ($mock) {
            $mock->shouldReceive('read')->andThrow(new QueryException('sqlite', 'private query', [], new \PDOException('private database details')));
        });
        $this->getJson('/api/experience')->assertStatus(503)->assertExactJson(['error' => 'ExperienceUnavailable']);
        Schema::drop('media_assets');
        $this->getJson('/api/media/'.Str::ulid())->assertStatus(503)->assertExactJson(['error' => 'MediaUnavailable']);
    }

    public function test_unconfigured_site_has_no_public_experience(): void
    {
        $this->getJson('/api/experience')->assertNotFound()->assertJsonPath('error', 'ExperienceNotConfigured');
        $this->seed();
        $this->getJson('/api/experience')->assertNotFound();
    }

    public function test_public_payload_is_whitelisted_ordered_and_filters_hidden_and_trashed_content(): void
    {
        $this->configureSite();
        $story = Section::where('key', 'horizontal_story')->first();
        StoryMemory::create(['section_id' => $story->id, 'title' => 'Second', 'position' => 2, 'date' => '2000-01-01']);
        StoryMemory::create(['section_id' => $story->id, 'title' => 'First', 'position' => 0, 'date' => '2026-01-01']);
        StoryMemory::create(['section_id' => $story->id, 'title' => 'Trashed', 'position' => 1])->delete();
        Section::where('key', 'intro')->first()->update(['visible' => false]);
        $data = $this->getJson('/api/experience')->assertOk()->json();
        $this->assertSame(['settings', 'hero', 'intro', 'sections', 'story', 'memoryPhoto', 'gallery', 'loveEntries', 'timeline'], array_keys($data));
        $this->assertSame(['First', 'Second'], array_column($data['story'], 'title'));
        $this->assertNull($data['story'][0]['photo']);
        $this->assertNull($data['memoryPhoto']);
        $this->assertNotContains('intro', array_column($data['sections'], 'key'));
        $this->assertSame(['key', 'visible', 'content'], array_keys($data['sections'][0]));
        $this->assertArrayNotHasKey('ownerUserId', $data['settings']);
        $this->assertArrayNotHasKey('version', $data['story'][0]);
        $story->update(['visible' => false]);
        $this->getJson('/api/experience')->assertJsonPath('story', []);
    }

    public function test_only_ready_existing_referenced_derivatives_are_public(): void
    {
        $this->configureSite();
        Storage::fake('local');
        Storage::disk('local')->put('derivatives/photo.webp', 'synthetic derivative');
        $asset = MediaAsset::create([
            'original_path' => 'private/original.jpg', 'original_mime_type' => 'image/jpeg', 'original_byte_size' => 500,
            'processing_state' => 'ready',
            'derivatives' => [['format' => 'webp', 'width' => 600, 'height' => 800, 'path' => 'derivatives/photo.webp', 'byte_size' => 20]],
        ]);
        $this->get('/api/media/'.$asset->id)->assertNotFound();
        $gallery = Section::where('key', 'gallery')->first();
        $item = GalleryItem::create(['section_id' => $gallery->id, 'media_asset_id' => $asset->id, 'alt_text' => 'Owner supplied alt', 'caption' => 'Caption']);
        $photo = $this->getJson('/api/experience')->assertOk()->json('gallery.0');
        $this->assertSame('/api/media/'.$asset->id, $photo['src']);
        $this->assertSame('Owner supplied alt', $photo['alt']);
        $this->assertSame(600, $photo['width']);
        $this->assertArrayNotHasKey('original_path', $photo);
        $this->get($photo['src'])->assertOk()->assertHeader('Content-Type', 'image/webp')->assertHeader('X-Content-Type-Options', 'nosniff');
        $asset->update(['processing_state' => 'pending']);
        $this->get($photo['src'])->assertNotFound();
        $this->getJson('/api/experience')->assertJsonPath('gallery', []);
        $asset->update(['processing_state' => 'ready']);
        $gallery->update(['visible' => false]);
        $this->get($photo['src'])->assertNotFound();
        $gallery->update(['visible' => true]);
        $item->delete();
        $this->get($photo['src'])->assertNotFound();
        $item->restore();
        Storage::disk('local')->delete('derivatives/photo.webp');
        $this->get($photo['src'])->assertNotFound();
        $this->getJson('/api/experience')->assertJsonPath('gallery', []);
        Storage::disk('local')->put('derivatives/photo.webp', 'synthetic derivative');
        $asset->delete();
        $this->get($photo['src'])->assertNotFound();
        $this->get('/api/media/not-an-id')->assertNotFound();
    }

    private function configureSite(): void
    {
        $this->seed();
        SiteSettings::find(1)->update(['recipient_name' => 'Test recipient']);
    }
}
