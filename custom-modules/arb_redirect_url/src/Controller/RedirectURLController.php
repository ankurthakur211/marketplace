<?php
namespace Drupal\arb_redirect_url\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\TrustedRedirectResponse;



class RedirectURLController extends ControllerBase{

	
	public function RedirectURL(){
		$url = \Drupal::request()->get('redirect-url');
                $search = "apimp-apic-b2a7a046-portal-web-mp-cp4i-nprd.apps.ocp.np4sitcl01.alrajhi.bank"; 
                $replace = "test.developer.api-marketplace.alrajhibank.com.sa";
		$url = str_replace($search,$replace,$url);
		$url = str_replace('"','',$url);
                $response = new TrustedRedirectResponse($url);
                $response->getCacheableMetadata()->setCacheMaxAge(0); 
		return $response;
	}

 
	
}

?>