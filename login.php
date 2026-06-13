<?php
/**
 * JOB NOVA - Login page migrated to React frontend.
 * Authentication is now handled by api/auth.php (REST endpoint).
 * Redirect to the React SPA which hosts the login UI.
 */
header('Location: http://localhost:5173/');
exit;
