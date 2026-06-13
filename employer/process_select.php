<?php
/**
 * JOB NOVA - Employer candidate select processor.
 * MIGRATED: Candidate selection is now handled by api/employer.php (POST action=select).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/employer.php with action=select."
]);
