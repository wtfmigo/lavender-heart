<?php

namespace App\Models;

use App\Enums\SectionKey;
use App\Support\SectionContent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Section extends Model
{
    protected $fillable = ['key', 'visible', 'content', 'version'];

    protected $attributes = ['visible' => true, 'version' => 1];

    protected static function booted(): void
    {
        static::addGlobalScope('canonical_order', function (Builder $query) {
            $cases = [];
            foreach (SectionKey::cases() as $position => $key) {
                $cases[] = "when '{$key->value}' then {$position}";
            }
            $query->orderByRaw('case sections.key '.implode(' ', $cases).' end');
        });

        static::saving(function (Section $section) {
            Validator::make($section->getAttributes(), [
                'key' => ['required', Rule::enum(SectionKey::class)],
                'visible' => ['required', 'boolean', ...($section->key?->isRequired() ? ['accepted'] : [])],
                'version' => ['required', 'integer', 'min:1'],
            ])->validate();

            SectionContent::validate($section->key, $section->content);
        });
    }

    protected function casts(): array
    {
        return ['key' => SectionKey::class, 'visible' => 'boolean', 'content' => 'array', 'version' => 'integer'];
    }
}
