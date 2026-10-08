<?php

namespace App\Http\Controllers;

use App\Models\MediaAsset;
use App\Services\PublicExperience;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class PublicExperienceController extends Controller
{
    public function show(PublicExperience $experience)
    {
        try {
            $data = $experience->read();
        } catch (QueryException $exception) {
            report($exception);

            return response()->json(['error' => 'ExperienceUnavailable'], 503);
        }

        return $data ? response()->json($data)->header('Cache-Control', 'no-store')
            : response()->json(['error' => 'ExperienceNotConfigured'], 404);
    }

    public function media(string $id, PublicExperience $experience)
    {
        try {
            $asset = MediaAsset::find($id);
            abort_unless($asset && $experience->referenced($asset), 404);
        } catch (QueryException $exception) {
            report($exception);

            return response()->json(['error' => 'MediaUnavailable'], 503);
        }
        $file = $experience->derivative($asset);
        abort_unless($file, 404);
        $mime = ['jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'avif' => 'image/avif'][$file['format']];

        return Storage::disk($asset->disk)->response($file['path'], 'photo.'.$file['format'], [
            'Content-Type' => $mime, 'X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'no-store',
        ]);
    }
}
