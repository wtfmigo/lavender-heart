<?php

use App\Enums\ThemePreset;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary()->default(1);
            $table->foreignId('owner_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->longText('recipient_name');
            $table->longText('nickname');
            $table->date('birthday_date')->nullable();
            $table->date('relationship_start_date')->nullable();
            $table->boolean('relationship_counter_visible')->default(false);
            $table->longText('closing_signature');
            $table->enum('theme_preset', array_column(ThemePreset::cases(), 'value'))->default(ThemePreset::default()->value);
            $table->unsignedInteger('version')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
