<?php

namespace App\Models;

use App\Enums\MediaProcessingState;
use App\Support\ListValue;
use Closure;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MediaAsset extends Model
{
    use HasUlids, SoftDeletes;

    protected $fillable = [
        'disk', 'original_path', 'original_mime_type', 'original_byte_size',
        'original_width', 'original_height', 'derivatives', 'processing_state', 'version',
    ];

    protected $attributes = ['disk' => 'local', 'derivatives' => '[]', 'processing_state' => 'pending', 'version' => 1];

    protected static function booted(): void
    {
        static::saving(function (MediaAsset $asset) {
            $path = function (string $attribute, mixed $value, Closure $fail): void {
                if (! is_string($value) || str_starts_with($value, '/') || preg_match('/[\\x00-\\x1f\\x7f\\\\\\\\:]/', $value)
                    || array_intersect(['.', '..'], explode('/', $value))) {
                    $fail('The :attribute field must be a relative Storage key without traversal.');
                }
            };
            Validator::make([...$asset->getAttributes(), 'derivatives' => $asset->derivatives], [
                'id' => ['sometimes', 'required', 'ulid'],
                'disk' => ['required', 'string', 'max:255'],
                'original_path' => ['required', 'string', $path],
                'original_mime_type' => ['required', Rule::in(['image/jpeg', 'image/png', 'image/webp'])],
                'original_byte_size' => ['required', 'integer', 'min:1'],
                'original_width' => ['nullable', Rule::requiredIf(($asset->getAttributes()['original_width'] ?? null) !== null), 'integer', 'min:1'],
                'original_height' => ['nullable', Rule::requiredIf(($asset->getAttributes()['original_height'] ?? null) !== null), 'integer', 'min:1'],
                'derivatives' => [new ListValue],
                'derivatives.*' => ['required', 'array:format,width,height,path,byte_size', 'required_array_keys:format,width,height,path,byte_size'],
                'derivatives.*.format' => ['required', Rule::in(['jpeg', 'png', 'webp', 'avif'])],
                'derivatives.*.width' => ['required', 'integer', 'min:1'],
                'derivatives.*.height' => ['required', 'integer', 'min:1'],
                'derivatives.*.path' => ['required', 'string', $path],
                'derivatives.*.byte_size' => ['required', 'integer', 'min:1'],
                'processing_state' => ['required', Rule::enum(MediaProcessingState::class)],
                'version' => ['required', 'integer', 'min:1'],
            ])->validate();
        });
    }

    protected function casts(): array
    {
        return [
            'original_byte_size' => 'integer', 'original_width' => 'integer', 'original_height' => 'integer',
            'derivatives' => 'array', 'processing_state' => MediaProcessingState::class, 'version' => 'integer',
        ];
    }
}
