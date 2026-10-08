<?php

namespace App\Support;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ListValue implements ValidationRule
{
    // Laravel otherwise skips rules for empty strings; empty arrays remain valid.
    public bool $implicit = true;

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value) || ! array_is_list($value)) {
            $fail('The :attribute field must be a list.');
        }
    }
}
