<?php
/**
 * JOB NOVA - Legacy form validation AJAX endpoint.
 * MIGRATED: All form validation is now handled client-side in the React frontend.
 * Email uniqueness check is included in api/auth.php registration logic.
 * This endpoint is no longer used.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Validation is performed client-side in the React app."
]);