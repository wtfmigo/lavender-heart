<?php

namespace App\Models\Concerns;

use App\Models\Section;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

trait HasCollectionPersistence
{
    public static function bootHasCollectionPersistence(): void
    {
        static::addGlobalScope('owner_order', function (Builder $query) {
            $query->orderBy($query->getModel()->qualifyColumn('position'))
                ->orderBy($query->getModel()->qualifyColumn('id'));
        });

        static::saving(function (Model $entry) {
            // Raw/bulk writes bypass this guard; later Actions must use validated model writes.
            Validator::make($entry->getAttributes(), [
                'section_id' => ['required', 'integer', Rule::exists('sections', 'id')->where('key', static::SECTION_KEY->value)],
                'position' => ['required', 'integer', 'min:0'],
                'version' => ['required', 'integer', 'min:1'],
            ])->validate();
        });
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }
}
