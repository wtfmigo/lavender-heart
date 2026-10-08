<?php

namespace Tests\Feature;

use App\Enums\MediaProcessingState;
use App\Models\MediaAsset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class MediaAssetPersistenceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->assertSame('sqlite', DB::connection()->getDriverName());
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
        $this->assertTrue(Schema::hasTable('media_assets'), 'A3 media migration must exist.');
    }

    private function metadata(array $overrides = []): array
    {
        return array_replace([
            'original_path' => 'originals/synthetic-image.jpg',
            'original_mime_type' => 'image/jpeg',
            'original_byte_size' => 1234,
        ], $overrides);
    }

    public function test_required_metadata_defaults_and_opaque_ulid_round_trip(): void
    {
        $asset = MediaAsset::create($this->metadata())->fresh();
        $this->assertTrue(Str::isUlid($asset->id));
        $this->assertFalse($asset->getIncrementing());
        $this->assertSame('string', $asset->getKeyType());
        $this->assertSame('local', $asset->disk);
        $this->assertSame('originals/synthetic-image.jpg', $asset->original_path);
        $this->assertSame('image/jpeg', $asset->original_mime_type);
        $this->assertSame(1234, $asset->original_byte_size);
        $this->assertNull($asset->original_width);
        $this->assertNull($asset->original_height);
        $this->assertSame([], $asset->derivatives);
        $this->assertSame(MediaProcessingState::Pending, $asset->processing_state);
        $this->assertSame(1, $asset->version);
        $this->assertNotNull($asset->created_at);
        $this->assertNotNull($asset->updated_at);
    }

    public function test_derivatives_dimensions_states_and_version_round_trip(): void
    {
        $derivatives = array_map(fn (string $format) => [
            'format' => $format, 'width' => 640, 'height' => 480,
            'path' => 'derivatives/synthetic-image.'.$format, 'byte_size' => 321,
        ], ['jpeg', 'png', 'webp', 'avif']);
        $asset = MediaAsset::create($this->metadata([
            'disk' => 's3', 'original_width' => 1280, 'original_height' => 960,
            'derivatives' => $derivatives, 'version' => 3,
        ]));
        foreach (MediaProcessingState::cases() as $state) {
            $asset->update(['processing_state' => $state]);
            $this->assertSame($state, $asset->fresh()->processing_state);
        }
        $asset->refresh();
        $this->assertSame($derivatives, $asset->derivatives);
        $this->assertSame(1280, $asset->original_width);
        $this->assertSame(960, $asset->original_height);
        $this->assertSame(3, $asset->version);
        $this->assertSame(['pending', 'ready', 'failed'], array_column(MediaProcessingState::cases(), 'value'));
    }

    #[DataProvider('invalidMetadata')]
    public function test_normal_saves_reject_invalid_metadata(array $values, string $field): void
    {
        try {
            MediaAsset::create($this->metadata($values));
            $this->fail('Invalid media metadata must be rejected.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey($field, $exception->errors());
        }
        $this->assertDatabaseCount('media_assets', 0);
    }

    public static function invalidMetadata(): array
    {
        return [
            'blank disk' => [['disk' => ''], 'disk'],
            'missing original' => [['original_path' => null], 'original_path'],
            'blank original' => [['original_path' => ''], 'original_path'],
            'windows absolute' => [['original_path' => 'C:\\photos\\image.jpg'], 'original_path'],
            'windows drive relative' => [['original_path' => 'C:image.jpg'], 'original_path'],
            'unix absolute' => [['original_path' => '/photos/image.jpg'], 'original_path'],
            'unc path' => [['original_path' => '\\\\server\\share\\image.jpg'], 'original_path'],
            'uri' => [['original_path' => 's3://bucket/image.jpg'], 'original_path'],
            'traversal' => [['original_path' => 'photos/../image.jpg'], 'original_path'],
            'backslash traversal' => [['original_path' => 'photos\\..\\image.jpg'], 'original_path'],
            'nul byte' => [['original_path' => "photos/\0image.jpg"], 'original_path'],
            'unsupported mime' => [['original_mime_type' => 'image/gif'], 'original_mime_type'],
            'zero bytes' => [['original_byte_size' => 0], 'original_byte_size'],
            'fractional bytes' => [['original_byte_size' => 1.5], 'original_byte_size'],
            'zero width' => [['original_width' => 0], 'original_width'],
            'blank width' => [['original_width' => ''], 'original_width'],
            'negative height' => [['original_height' => -1], 'original_height'],
            'blank height' => [['original_height' => ''], 'original_height'],
            'zero version' => [['version' => 0], 'version'],
            'fractional version' => [['version' => 1.5], 'version'],
            'null derivatives' => [['derivatives' => null], 'derivatives'],
            'blank derivatives' => [['derivatives' => ''], 'derivatives'],
            'object derivatives' => [['derivatives' => ['named' => []]], 'derivatives'],
            'blank derivative' => [['derivatives' => ['']], 'derivatives.0'],
            'unknown derivative key' => [['derivatives' => [[
                'format' => 'webp', 'width' => 1, 'height' => 1, 'path' => 'image.webp', 'byte_size' => 1, 'quality' => 80,
            ]]], 'derivatives.0'],
            'missing derivative keys' => [['derivatives' => [['format' => 'webp']]], 'derivatives.0'],
            'unsupported derivative format' => [['derivatives' => [[
                'format' => 'gif', 'width' => 1, 'height' => 1, 'path' => 'image.gif', 'byte_size' => 1,
            ]]], 'derivatives.0.format'],
            'zero derivative width' => [['derivatives' => [[
                'format' => 'webp', 'width' => 0, 'height' => 1, 'path' => 'image.webp', 'byte_size' => 1,
            ]]], 'derivatives.0.width'],
            'absolute derivative' => [['derivatives' => [[
                'format' => 'webp', 'width' => 1, 'height' => 1, 'path' => '/image.webp', 'byte_size' => 1,
            ]]], 'derivatives.0.path'],
            'traversing derivative' => [['derivatives' => [[
                'format' => 'webp', 'width' => 1, 'height' => 1, 'path' => '../image.webp', 'byte_size' => 1,
            ]]], 'derivatives.0.path'],
            'blank derivative path' => [['derivatives' => [[
                'format' => 'webp', 'width' => 1, 'height' => 1, 'path' => '', 'byte_size' => 1,
            ]]], 'derivatives.0.path'],
        ];
    }

    public function test_unknown_processing_state_is_rejected(): void
    {
        $this->expectException(\ValueError::class);
        MediaAsset::create($this->metadata(['processing_state' => 'uploading']));
    }

    public function test_updates_validate_metadata_before_persistence(): void
    {
        $asset = MediaAsset::create($this->metadata());
        try {
            $asset->update(['original_path' => '../image.jpg']);
            $this->fail('Traversal must be rejected on updates.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('original_path', $exception->errors());
        }
        $this->assertSame('originals/synthetic-image.jpg', $asset->fresh()->original_path);
    }

    public function test_soft_delete_and_restore_preserve_metadata_without_storage_io(): void
    {
        Storage::shouldReceive('disk')->never();
        Storage::shouldReceive('delete')->never();
        Storage::shouldReceive('put')->never();
        $asset = MediaAsset::create($this->metadata());
        $asset->delete();
        $this->assertSoftDeleted('media_assets', ['id' => $asset->id]);
        $this->assertNull(MediaAsset::find($asset->id));
        $trashed = MediaAsset::withTrashed()->findOrFail($asset->id);
        $this->assertSame('originals/synthetic-image.jpg', $trashed->original_path);
        $trashed->restore();
        $this->assertNull($trashed->fresh()->deleted_at);
        $this->assertSame(1, $trashed->fresh()->version);
    }
}
