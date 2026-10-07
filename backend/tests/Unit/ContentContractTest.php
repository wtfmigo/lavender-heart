<?php

namespace Tests\Unit;

use App\Enums\SectionKey;
use App\Enums\ThemePreset;
use PHPUnit\Framework\TestCase;

class ContentContractTest extends TestCase
{
    public function test_fixed_chapter_values_and_order(): void
    {
        $values = array_column(SectionKey::cases(), 'value');

        $this->assertSame([
            'hero', 'intro', 'horizontal_story', 'full_width_memory', 'gallery',
            'things_i_love', 'timeline', 'birthday_letter', 'final_closing',
        ], $values);
    }

    public function test_only_hero_and_final_closing_are_required(): void
    {
        $required = array_values(array_filter(SectionKey::cases(), fn (SectionKey $key) => $key->isRequired()));

        $this->assertSame(['hero', 'final_closing'], array_column($required, 'value'));
    }

    public function test_fixed_presets_and_default(): void
    {
        $values = array_column(ThemePreset::cases(), 'value');

        $this->assertSame(['lavender_mist', 'lavender_night', 'pearl_lavender'], $values);
        $this->assertSame('lavender_mist', ThemePreset::default()->value);
        $this->assertNull(ThemePreset::tryFrom('custom'));
        $this->assertNull(SectionKey::tryFrom('custom'));
    }
}
