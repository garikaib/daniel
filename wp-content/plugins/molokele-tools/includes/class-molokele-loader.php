<?php
/**
 * Main Loader class for Molokele Tools.
 *
 * @package Molokele_Tools
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Molokele_Loader' ) ) {
	/**
	 * Class Molokele_Loader
	 */
	class Molokele_Loader {

		/**
		 * Loader instance.
		 *
		 * @var Molokele_Loader
		 */
		private static $instance = null;

		/**
		 * Retrieve singleton instance.
		 *
		 * @return Molokele_Loader
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor.
		 */
		private function __construct() {
			$this->load_dependencies();
			$this->init_modules();
		}

		/**
		 * Load core utilities.
		 */
		private function load_dependencies() {
			require_once plugin_dir_path( __FILE__ ) . 'utils/class-molokele-helper.php';
		}

		/**
		 * Load and initialize modules.
		 */
		private function init_modules() {
			// List of modular features.
			$modules = array();

			foreach ( $modules as $file_name => $class_name ) {
				$file_path = plugin_dir_path( __FILE__ ) . 'modules/class-' . $file_name . '.php';
				if ( file_exists( $file_path ) ) {
					require_once $file_path;
					if ( class_exists( $class_name ) ) {
						new $class_name();
					}
				}
			}
		}
	}
}
