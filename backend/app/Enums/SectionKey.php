<?php

namespace App\Enums;

enum SectionKey: string
{
    case Hero = 'hero';
    case Intro = 'intro';
    case HorizontalStory = 'horizontal_story';
    case FullWidthMemory = 'full_width_memory';
    case Gallery = 'gallery';
    case ThingsILove = 'things_i_love';
    case Timeline = 'timeline';
    case BirthdayLetter = 'birthday_letter';
    case FinalClosing = 'final_closing';

    public function isRequired(): bool
    {
        return $this === self::Hero || $this === self::FinalClosing;
    }
}
