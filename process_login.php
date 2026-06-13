<?php
/**
 * JOB NOVA - Legacy login processor.
 * MIGRATED: Authentication is now handled by api/auth.php (POST action=login).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/auth.php with action=login."
]);