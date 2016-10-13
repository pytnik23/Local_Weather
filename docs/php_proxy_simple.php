<?php

// Allowed hostname (api.local and api.travel are also possible here)
define ('HOSTNAME', 'https://api.darksky.net/forecast/07384ebfcecc402230f46dd9b2267474/');

// Get the REST call path from the AJAX application
// It is a GET?
$path = $_GET['yws_path'];
$url = HOSTNAME.$path;

// Open the Curl session
$session = curl_init($url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$xml = curl_exec($session);

// The web service returns JSON. Set the Content-Type appropriately
header("Content-Type: application/json");

echo $xml;
curl_close($session);

?>