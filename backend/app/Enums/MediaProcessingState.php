<?php

namespace App\Enums;

enum MediaProcessingState: string
{
    // Original metadata is stored; derivative processing has not completed.
    case Pending = 'pending';
    // Processing completed and stored derivative metadata can be used.
    case Ready = 'ready';
    // Processing failed; the original remains available for recovery.
    case Failed = 'failed';
}
