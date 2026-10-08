<?php

namespace App\Services;

use App\Enums\MediaProcessingState;
use App\Enums\SectionKey;
use App\Models\GalleryItem;
use App\Models\LoveEntry;
use App\Models\MediaAsset;
use App\Models\Section;
use App\Models\SiteSettings;
use App\Models\StoryMemory;
use App\Models\TimelineMoment;
use App\Support\SectionContent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PublicExperience
{
    public function read(): ?array
    {
        $settings = SiteSettings::find(1);
        $sections = Section::where('visible', true)->get()->keyBy(fn ($section) => $section->key->value);
        if (! $settings || trim($settings->recipient_name) === '' || ! $sections->has(['hero', 'final_closing'])) {
            return null;
        }

        $entries = fn (string $model, string $key) => $sections->has($key)
            ? $model::where('section_id', $sections[$key]->id)->with('mediaAsset')->get()
            : collect();
        $memories = fn ($items) => $items->map(fn ($item) => [
            'id' => (string) $item->id, 'title' => $item->title ?? '', 'date' => $item->date,
            'message' => $item->message, 'photo' => $this->photo($item), 'position' => $item->position,
        ])->values()->all();

        return [
            'settings' => [
                'recipientName' => $settings->recipient_name, 'nickname' => $settings->nickname,
                'birthdayDate' => $settings->birthday_date, 'relationshipStartDate' => $settings->relationship_start_date,
                'relationshipCounterVisible' => $settings->relationship_counter_visible,
                'closingSignature' => $settings->closing_signature, 'themePreset' => $settings->theme_preset->value,
            ],
            'hero' => $sections['hero']->content,
            'intro' => $sections->get('intro')?->content ?? SectionContent::defaults(SectionKey::Intro),
            'sections' => $sections->map(fn ($section) => [
                'key' => $section->key->value, 'visible' => true, 'content' => $section->content,
            ])->values()->all(),
            'story' => $memories($entries(StoryMemory::class, 'horizontal_story')),
            // ponytail: the approved full-width chapter has no media assignment; add one with its editor contract.
            'memoryPhoto' => null,
            'gallery' => $entries(GalleryItem::class, 'gallery')->map(fn ($item) => $this->photo($item))->filter()->values()->all(),
            'loveEntries' => $sections->has('things_i_love')
                ? LoveEntry::where('section_id', $sections['things_i_love']->id)->get()->map(fn ($item) => [
                    'id' => (string) $item->id, 'statement' => $item->statement,
                    'supportingText' => $item->supporting_text ?? '', 'position' => $item->position,
                ])->all() : [],
            'timeline' => $memories($entries(TimelineMoment::class, 'timeline')),
        ];
    }

    public function derivative(?MediaAsset $asset): ?array
    {
        if (! $asset || $asset->trashed() || $asset->processing_state !== MediaProcessingState::Ready
            || ! in_array($asset->disk, ['local', 'public'], true)) {
            return null;
        }
        $available = array_filter($asset->derivatives, function ($file) use ($asset) {
            $path = $file['path'] ?? '';

            return in_array($file['format'] ?? '', ['jpeg', 'png', 'webp', 'avif'], true)
                && ($file['width'] ?? 0) > 0 && ($file['height'] ?? 0) > 0
                && is_string($path) && $path !== '' && ! str_starts_with($path, '/')
                && ! preg_match('/[\x00-\x1f\x7f\\\\:]/', $path)
                && ! array_intersect(['.', '..'], explode('/', $path))
                && $path !== $asset->original_path && Storage::disk($asset->disk)->exists($path);
        });
        usort($available, fn ($a, $b) => $b['width'] <=> $a['width']);

        return $available[0] ?? null;
    }

    public function referenced(MediaAsset $asset): bool
    {
        foreach ([StoryMemory::class, GalleryItem::class, TimelineMoment::class] as $model) {
            if ($model::where('media_asset_id', $asset->id)->whereHas('section', fn ($query) => $query->where('visible', true))->exists()) {
                return true;
            }
        }

        return false;
    }

    private function photo(Model $entry): ?array
    {
        $file = $this->derivative($entry->mediaAsset);
        if (! $file) {
            return null;
        }

        return [
            'id' => (string) $entry->id, 'src' => '/api/media/'.$entry->mediaAsset->id,
            'alt' => $entry instanceof GalleryItem ? $entry->alt_text : ($entry->title ?? ''),
            'width' => $file['width'], 'height' => $file['height'], 'caption' => $entry->caption ?? '',
            'focalX' => $entry->focal_x, 'focalY' => $entry->focal_y,
        ];
    }
}
