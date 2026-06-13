<?php
/**
 * JOB NOVA - Employer registration processor.
 * MIGRATED: Employer registration is now handled by api/auth.php (POST action=register_employer).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/auth.php with action=register_employer."
]);