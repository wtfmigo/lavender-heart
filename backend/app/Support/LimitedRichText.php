<?php

namespace App\Support;

use Illuminate\Validation\Rule;

class LimitedRichText
{
    public static function rules(string $path): array
    {
        $children = $path.'.blocks.*.children';

        return [
            $path => ['required', 'array:blocks', 'required_array_keys:blocks'],
            $path.'.blocks' => [new ListValue],
            $path.'.blocks.*' => ['array:type,children', 'required_array_keys:type,children'],
            $path.'.blocks.*.type' => ['required', Rule::in(['paragraph', 'blockquote'])],
            $children => [new ListValue],
            $children.'.*' => Rule::forEach(fn (mixed $inline) => is_array($inline) && ($inline['type'] ?? null) === 'line_break'
                ? ['array:type', 'required_array_keys:type']
                : ['array:type,text,marks', 'required_array_keys:type,text']),
            $children.'.*.type' => ['required', Rule::in(['text', 'line_break'])],
            $children.'.*.text' => ['string'],
            $children.'.*.marks' => ['sometimes', new ListValue],
            $children.'.*.marks.*' => ['required', 'string', Rule::in(['bold', 'italic'])],
        ];
    }
}
