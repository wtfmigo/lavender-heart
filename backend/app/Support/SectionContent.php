<?php

namespace App\Support;

use App\Enums\SectionKey;
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
        foreach ($defaults as $field => $default) {
            $path = 'content.'.$field;
            if ($field === 'date') {
                $rules[$path] = ['nullable', Rule::requiredIf(($content['date'] ?? null) !== null), 'date_format:Y-m-d'];
            } elseif (is_array($default)) {
                $rules += LimitedRichText::rules($path);
            } else {
                $rules[$path] = ['string'];
            }
        }

        Validator::make(['content' => $content], $rules)->validate();
    }
}
