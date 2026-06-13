<?php
/**
 * JOB NOVA - Forgot password page migrated to React frontend.
 * Password reset is now handled via api/auth.php (action=forgot).
 * Redirect to the React SPA.
 */
header('Location: http://localhost:5173/');
exit;