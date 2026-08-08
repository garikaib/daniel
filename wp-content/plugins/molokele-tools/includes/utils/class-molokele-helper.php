<?php
/**
 * Shared Helper Functions for Molokele Tools.
 *
 * @package Molokele_Tools
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Molokele_Helper' ) ) {
	/**
	 * Class Molokele_Helper
	 */
	class Molokele_Helper {

		/**
		 * Check if the current request is a REST API request.
		 *
		 * @return bool
		 */
		public static function is_rest_request() {
			if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
				return true;
			}

			// Fallback check based on request URI.
			if ( ! empty( $_SERVER['REQUEST_URI'] ) && false !== strpos( $_SERVER['REQUEST_URI'], '/' . rest_get_url_prefix() . '/' ) ) {
				return true;
			}

			return false;
		}

		/**
		 * Redirect to admin dashboard.
		 *
		 * @return void
		 */
		public static function safe_redirect_to_dashboard() {
			wp_safe_redirect( admin_url( '/' ) );
			exit;
		}
	}
}
