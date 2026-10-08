<?php

namespace App\Models;

use App\Enums\SectionKey;
use App\Models\Concerns\HasCollectionPersistence;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Validator;

class LoveEntry extends Model
{
    use HasCollectionPersistence, SoftDeletes;

    protected const SECTION_KEY = SectionKey::ThingsILove;

    protected $fillable = ['section_id', 'statement', 'supporting_text', 'position', 'version'];

    protected $attributes = ['statement' => '', 'position' => 0, 'version' => 1];

    protected static function booted(): void
    {
        static::saving(function (LoveEntry $entry) {
            Validator::make($entry->getAttributes(), [
                'statement' => ['present', 'string'],
                'supporting_text' => ['nullable', 'string'],
            ])->validate();
        });
    }

    protected function casts(): array
    {
        return ['position' => 'integer', 'version' => 'integer'];
    }
}
