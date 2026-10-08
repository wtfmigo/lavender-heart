<?php

namespace App\Models;

use App\Enums\SectionKey;
use App\Models\Concerns\HasCollectionPersistence;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class GalleryItem extends Model
{
    use HasCollectionPersistence, SoftDeletes;

    protected const SECTION_KEY = SectionKey::Gallery;

    protected $fillable = ['section_id', 'media_asset_id', 'alt_text', 'caption', 'date', 'focal_x', 'focal_y', 'position', 'version'];

    protected $attributes = ['alt_text' => '', 'focal_x' => 0.5, 'focal_y' => 0.5, 'position' => 0, 'version' => 1];

    protected static function booted(): void
    {
        static::saving(function (GalleryItem $entry) {
            Validator::make($entry->getAttributes(), [
                'media_asset_id' => ['required', 'ulid'],
                'alt_text' => ['present', 'string'],
                'caption' => ['nullable', 'string'],
                'date' => ['nullable', Rule::requiredIf(($entry->getAttributes()['date'] ?? null) !== null), 'date_format:Y-m-d'],
                'focal_x' => ['required', 'numeric', 'between:0,1'],
                'focal_y' => ['required', 'numeric', 'between:0,1'],
            ])->validate();
        });
    }

    protected function casts(): array
    {
        return ['focal_x' => 'float', 'focal_y' => 'float', 'position' => 'integer', 'version' => 'integer'];
    }

    public function mediaAsset(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class)->withTrashed();
    }
}
