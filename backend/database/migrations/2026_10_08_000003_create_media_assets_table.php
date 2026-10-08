<?php

use App\Enums\MediaProcessingState;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('disk')->default('local');
            $table->text('original_path');
            $table->enum('original_mime_type', ['image/jpeg', 'image/png', 'image/webp']);
            $table->unsignedBigInteger('original_byte_size');
            $table->unsignedInteger('original_width')->nullable();
            $table->unsignedInteger('original_height')->nullable();
            $table->json('derivatives');
            $table->enum('processing_state', array_column(MediaProcessingState::cases(), 'value'))->default('pending');
            $table->unsignedInteger('version')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};
