<?php

namespace App\Support;

use App\Enums\SectionKey;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SectionContent
{
    public static function defaults(SectionKey $key): array
    {
        return match ($key) {
            SectionKey::Hero => ['title' => '', 'subtitle' => ''],
            SectionKey::Intro => ['message' => ['blocks' => []], 'supportingText' => ''],
            SectionKey::FullWidthMemory => ['caption' => '', 'date' => null],
            SectionKey::BirthdayLetter => ['heading' => '', 'opening' => '', 'body' => ['blocks' => []], 'signature' => '', 'date' => null],
            SectionKey::FinalClosing => ['message' => ['blocks' => []], 'date' => null],
            default => ['heading' => ''],
        };
    }

    public static function validate(SectionKey $key, mixed $content): void
    {
        $defaults = self::defaults($key);
        $fields = implode(',', array_keys($defaults));
        $rules = ['content' => ['required', 'array:'.$fields, 'required_array_keys:'.$fields]];
        // Laravel skips non-implicit type rules for empty strings; lists may be empty arrays.
        $list = new class implements ValidationRule
        {
            public bool $implicit = true;

            public function validate(string $attribute, mixed $value, Closure $fail): void
            {
                if (! is_array($value) || ! array_is_list($value)) {
                    $fail('The :attribute field must be a list.');
                }
            }
        };

        foreach ($defaults as $field => $default) {
            $path = 'content.'.$field;
            if ($field === 'date') {
                $rules[$path] = ['nullable', Rule::requiredIf(($content['date'] ?? null) !== null), 'date_format:Y-m-d'];
            } elseif (is_array($default)) {
                $rules[$path] = ['array:blocks', 'required_array_keys:blocks'];
                $rules[$path.'.blocks'] = [$list];
                $rules[$path.'.blocks.*'] = ['array:type,children', 'required_array_keys:type,children'];
                $rules[$path.'.blocks.*.type'] = ['required', Rule::in(['paragraph', 'blockquote'])];
                $children = $path.'.blocks.*.children';
                $rules[$children] = [$list];
                $rules[$children.'.*'] = Rule::forEach(fn (mixed $inline) => is_array($inline) && ($inline['type'] ?? null) === 'line_break'
                    ? ['array:type', 'required_array_keys:type']
                    : ['array:type,text,marks', 'required_array_keys:type,text']);
                $rules[$children.'.*.type'] = ['required', Rule::in(['text', 'line_break'])];
                $rules[$children.'.*.text'] = ['string'];
                $rules[$children.'.*.marks'] = ['sometimes', $list];
                $rules[$children.'.*.marks.*'] = ['required', 'string', Rule::in(['bold', 'italic'])];
            } else {
                $rules[$path] = ['string'];
            }
        }

        Validator::make(['content' => $content], $rules)->validate();
    }
}
