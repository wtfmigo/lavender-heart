<?php

namespace App\Models;

use App\Enums\ThemePreset;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SiteSettings extends Model
{
    public $incrementing = false;

    protected $table = 'site_settings';

    protected $fillable = [
        'owner_user_id', 'recipient_name', 'nickname', 'birthday_date',
        'relationship_start_date', 'relationship_counter_visible',
        'closing_signature', 'theme_preset', 'version',
    ];

    protected $attributes = [
        'id' => 1, 'owner_user_id' => null, 'recipient_name' => '', 'nickname' => '',
        'birthday_date' => null, 'relationship_start_date' => null,
        'relationship_counter_visible' => false, 'closing_signature' => '',
        'theme_preset' => 'lavender_mist', 'version' => 1,
    ];

    protected static function booted(): void
    {
        static::saving(function (SiteSettings $settings) {
            Validator::make($settings->getAttributes(), [
                'id' => ['required', 'integer', 'in:1'],
                'recipient_name' => ['present', 'string'],
                'nickname' => ['present', 'string'],
                'birthday_date' => ['nullable', Rule::requiredIf($settings->birthday_date !== null), 'date_format:Y-m-d'],
                'relationship_start_date' => ['nullable', Rule::requiredIf($settings->relationship_start_date !== null), 'date_format:Y-m-d'],
                'relationship_counter_visible' => ['required', 'boolean'],
                'closing_signature' => ['present', 'string'],
                'version' => ['required', 'integer', 'min:1'],
            ])->validate();
        });
    }

    protected function casts(): array
    {
        return [
            // SQL DATE values stay canonical strings, without datetime conversion.
            'theme_preset' => ThemePreset::class,
            'relationship_counter_visible' => 'boolean',
            'version' => 'integer',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }
}
