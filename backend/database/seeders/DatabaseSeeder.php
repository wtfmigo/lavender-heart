<?php

namespace Database\Seeders;

use App\Enums\SectionKey;
use App\Models\Section;
use App\Models\SiteSettings;
use App\Support\SectionContent;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        SiteSettings::firstOrCreate(['id' => 1]);

        foreach (SectionKey::cases() as $key) {
            Section::firstOrCreate(['key' => $key], ['content' => SectionContent::defaults($key)]);
        }
    }
}
