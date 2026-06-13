<?php
/**
 * JOB NOVA - Employer candidate reject processor.
 * MIGRATED: Candidate rejection is now handled by api/employer.php (POST action=reject).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/employer.php with action=reject."
]);