<?php

namespace App\Enums;

enum ThemePreset: string
{
    case LavenderMist = 'lavender_mist';
    case LavenderNight = 'lavender_night';
    case PearlLavender = 'pearl_lavender';

    public static function default(): self
    {
        return self::LavenderMist;
    }
}
