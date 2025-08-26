<?php

namespace Drupal\invite_user_api\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Controller\ControllerBase;

class InviteUserController extends ControllerBase {

  public function submit(Request $request) {
    $data = json_decode($request->getContent(), true);
    
    
    $errors = [];

    // Check for empty or invalid fields
    if (empty($data['user']['first_name']) || strlen(trim($data['user']['first_name'])) < 2) {
        $errors[] = 'First name is required and should be at least 2 characters.';
    }

    if (empty($data['user']['last_name']) || strlen(trim($data['user']['last_name'])) < 2) {
        $errors[] = 'Last name is required and should be at least 2 characters.';
    }

    if (empty($data['user']['email']) || !filter_var($data['user']['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'A valid email address is required.';
    }

    if (empty($data['consumer_org']['id']) || empty($data['consumer_org']['roles'][0])) {
        $errors[] = 'Organization ID and at least one role are required.';
    }

    // If there are errors, return them
    if (!empty($errors)) {
        return new JsonResponse(['status' => 'error', 'messages' => $errors], 400);
    }

    if (!$data) {
      return new JsonResponse(['error' => 'Invalid JSON'], 400);
    }

    $target_url = 'https://apimarketp-6419a8ad-gateway-mp-cp4i-nprd.apps.ocp.np4sitcl01.alrajhi.bank/apimarketplace-sit/sandbox-inbound/portal/v1/users/invite-member';

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