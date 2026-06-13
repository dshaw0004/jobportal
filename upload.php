<?php
/**
 * JOB NOVA - Legacy file upload handler.
 * MIGRATED: File uploads are now handled by api/upload.php.
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/upload.php?type=image|file|logo"
]);