<?php

namespace Drupal\invite_user_api\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Controller\ControllerBase;

class InviteUserController extends ControllerBase {

  public function submit(Request $request) {
    $data = json_decode($request->getContent(), true);

    if (!$data) {
      return new JsonResponse(['error' => 'Invalid JSON'], 400);
    }

    $target_url = 'https://sit.public.api-marketplace.alrajhibank.com.sa/apimarketplace-sit/api-marketplace-public-sit/portal/v1/users/invite-member';

    // Prepare headers with client_id and client_secret
    $headers = [
      'Content-Type: application/json',
      'client_id: 2406f058f98048f93f309e4d699a5e92',
      'client_secret: e1dcf2cd61c44526271bcfebc4921fc6',
    ];

    // Forward the request using cURL
    $ch = curl_init($target_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
      return new JsonResponse(['error' => $error], 500);
    }

    return new JsonResponse(json_decode($response, true), $httpCode);
  }
}