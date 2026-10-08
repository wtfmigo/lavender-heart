<?php

namespace App\Models;

use App\Enums\SectionKey;
use App\Models\Concerns\HasCollectionPersistence;
use App\Support\LimitedRichText;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class StoryMemory extends Model
{
    use HasCollectionPersistence, SoftDeletes;

    protected const SECTION_KEY = SectionKey::HorizontalStory;

    protected $fillable = ['section_id', 'title', 'date', 'message', 'media_asset_id', 'focal_x', 'focal_y', 'position', 'version'];

    protected $attributes = ['message' => '{"blocks":[]}', 'focal_x' => 0.5, 'focal_y' => 0.5, 'position' => 0, 'version' => 1];

    protected static function booted(): void
    {
        static::saving(function (StoryMemory $entry) {
            Validator::make([...$entry->getAttributes(), 'message' => $entry->message], [
                'title' => ['nullable', 'string'],
                'date' => ['nullable', Rule::requiredIf(($entry->getAttributes()['date'] ?? null) !== null), 'date_format:Y-m-d'],
                'media_asset_id' => ['nullable', Rule::requiredIf(($entry->getAttributes()['media_asset_id'] ?? null) !== null), 'ulid'],
                'focal_x' => ['required', 'numeric', 'between:0,1'],
                'focal_y' => ['required', 'numeric', 'between:0,1'],
                ...LimitedRichText::rules('message'),
            ])->validate();
        });
    }

    protected function casts(): array
    {
        return ['message' => 'array', 'focal_x' => 'float', 'focal_y' => 'float', 'position' => 'integer', 'version' => 'integer'];
    }

    public function mediaAsset(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class)->withTrashed();
    }
}
