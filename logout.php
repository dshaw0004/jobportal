<?php
/**
 * JOB NOVA - Legacy logout handler.
 * MIGRATED: Logout is now handled by api/auth.php (POST action=logout).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/auth.php with action=logout."
]);