<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('story_memories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained()->restrictOnDelete();
            $table->longText('title')->nullable();
            $table->date('date')->nullable();
            $table->json('message');
            $table->foreignUlid('media_asset_id')->nullable()->constrained()->restrictOnDelete();
            $table->decimal('focal_x', 5, 4)->default(0.5);
            $table->decimal('focal_y', 5, 4)->default(0.5);
            $table->unsignedInteger('position')->default(0);
            $table->unsignedInteger('version')->default(1);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['section_id', 'position', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('story_memories');
    }
};
