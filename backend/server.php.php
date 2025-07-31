<?php
// Suppress deprecated notices from appearing in HTTP responses
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', '0');
/**
 * Router for PHP's built-in web server.
 * If the requested path exists in /public it's served directly,
 * otherwise the request is handed to Laravel's front-controller.
 */
// Handle CORS preflight requests for any path
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    http_response_code(204);
    exit;
}

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;    // serve the static file
}

require_once __DIR__.'/public/index.php';