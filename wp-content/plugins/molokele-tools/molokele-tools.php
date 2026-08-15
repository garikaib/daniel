<?php
/**
 * Plugin Name: Molokele Tools
 * Description: Utility plugin scaffold for Hon. Daniel Molokele (Hwange Central MP).
 * Version: 0.1.0
 * Author: Garikai Dzoma
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Bootstrap loader.
require_once plugin_dir_path( __FILE__ ) . 'includes/class-molokele-loader.php';
Molokele_Loader::get_instance();

/**
 * Check if the Vite dev server for the plugin is running on port 5174.
 */
function molokele_tools_is_vite_dev() {
	static $is_dev = null;
	if ( null !== $is_dev ) {
		return $is_dev;
	}

	if ( defined( 'MOLOKELE_TOOLS_VITE_DEV' ) ) {
		$is_dev = MOLOKELE_TOOLS_VITE_DEV;
		return $is_dev;
	}

	// Inside DDEV/Docker, the host is host.docker.internal. On local machine, it's 127.0.0.1.
	$host = 'host.docker.internal';
	if ( ! gethostbyname( $host ) || gethostbyname( $host ) === $host ) {
		$host = '127.0.0.1';
	}

	$connection = @fsockopen( $host, 5174, $errno, $errstr, 0.05 );
	if ( $connection ) {
		fclose( $connection );
		$is_dev = true;
	} else {
		$is_dev = false;
	}

	return $is_dev;
}

/**
 * Register the admin menu page for Molokele Tools.
 */
add_action(
	'admin_menu',
	function () {
		add_menu_page(
			'Molokele Tools',              // Page title
			'Molokele Tools',              // Menu title
			'manage_options',              // Capability
			'molokele-tools',              // Menu slug
			'molokele_tools_render_admin_page', // Callback function
			'dashicons-admin-generic',     // Icon
			80                              // Position
		);
	}
);

/**
 * Render the admin page container.
 */
function molokele_tools_render_admin_page() {
	?>
	<div class="wrap">
		<div id="molokele-tools-root"></div>
	</div>
	<?php
}

/**
 * Enqueue scripts and styles in the admin area.
 */
add_action(
	'admin_enqueue_scripts',
	function ( $hook ) {
		// Only load assets on our plugin page to avoid conflict with other admin views.
		if ( 'toplevel_page_molokele-tools' !== $hook ) {
			return;
		}

		wp_enqueue_media();

		$plugin_url = plugin_dir_url( __FILE__ );
		$plugin_dir = plugin_dir_path( __FILE__ );

		if ( molokele_tools_is_vite_dev() ) {
			// Enqueue Vite client.
			wp_enqueue_script( 'molokele-tools-vite-client', 'http://localhost:5174/@vite/client', array(), null, false );

			// Enqueue the entry react application.
			wp_enqueue_script( 'molokele-tools', 'http://localhost:5174/wp-content/plugins/molokele-tools/src/admin/main.jsx', array( 'molokele-tools-vite-client' ), null, true );
		} else {
			// Production mode.
			$css_path = $plugin_dir . 'dist/molokele-tools.css';
			$js_path  = $plugin_dir . 'dist/molokele-tools.js';

			if ( file_exists( $css_path ) ) {
				wp_enqueue_style( 'molokele-tools', $plugin_url . 'dist/molokele-tools.css', array(), filemtime( $css_path ) );
			}

			if ( file_exists( $js_path ) ) {
				wp_enqueue_script( 'molokele-tools', $plugin_url . 'dist/molokele-tools.js', array(), filemtime( $js_path ), true );
			}
		}

		wp_localize_script(
			'molokele-tools',
			'molokeleToolsData',
			array(
				'nonce'      => wp_create_nonce( 'wp_rest' ),
				'restUrl'    => esc_url_raw( rest_url( 'molokele/v1/' ) ),
				'adminEmail' => get_option( 'admin_email' ),
			)
		);
	}
);

/**
 * Add type="module" to script loader tags for Vite compatibility in the admin area.
 */
add_filter(
	'script_loader_tag',
	function ( $tag, $handle, $src ) {
		if ( in_array( $handle, array( 'molokele-tools', 'molokele-tools-vite-client' ), true ) ) {
			return '<script type="module" src="' . esc_url( $src ) . '" id="' . esc_attr( $handle ) . '-js"></script>';
		}
		return $tag;
	},
	10,
	3
);

/**
 * Register REST API routes for settings.
 */
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'molokele/v1',
			'/settings',
			array(
				// Public: the front end (visited by anonymous site visitors) reads
				// these to render the gallery — only saving requires admin rights.
				'methods'             => 'GET',
				'callback'            => 'molokele_tools_get_settings',
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'molokele/v1',
			'/settings',
			array(
				'methods'             => 'POST',
				'callback'            => 'molokele_tools_save_settings',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}
);

function molokele_tools_get_settings() {
	$default_settings = array(
		'columns'         => '3',
		'shadow'          => 'shadow-md',
		'border_radius'   => 'rounded-sm',
		'autoplay'        => false,
		'autoplay_speed'  => '3000',
		'backdrop_blur'   => 'backdrop-blur-md',
	);

	$settings = get_option( 'molokele_gallery_settings', $default_settings );
	return rest_ensure_response( $settings );
}

function molokele_tools_save_settings( $request ) {
	$params = $request->get_json_params();
	update_option( 'molokele_gallery_settings', $params );
	return rest_ensure_response( array( 'success' => true ) );
}

/**
 * Register REST API routes for the homepage hero slider.
 */
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'molokele/v1',
			'/hero-slides',
			array(
				// Public: the homepage hero reads these to render the slider —
				// only saving requires admin rights.
				'methods'             => 'GET',
				'callback'            => 'molokele_tools_get_hero_slides',
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'molokele/v1',
			'/hero-slides',
			array(
				'methods'             => 'POST',
				'callback'            => 'molokele_tools_save_hero_slides',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}
);

/**
 * Ships with three real slides so the hero never appears broken before
 * anyone has touched the admin screen — same seeding pattern as gallery
 * settings above.
 */
function molokele_tools_default_hero_slides() {
	return array(
		array(
			'id'          => 'slide-1',
			'image'       => '',
			'image_id'    => 0,
			'position'    => 'bg-top',
			'badge'       => 'Legislative Leadership',
			'title'       => 'Parliamentary Action',
			'description' => "Advocating for Whange Central in the National Assembly through key debates and workers' rights legislation.",
			'cta_label'   => 'CDF Tracker',
			'cta_url'     => '/cdf-tracker/',
		),
		array(
			'id'          => 'slide-2',
			'image'       => '',
			'image_id'    => 0,
			'position'    => 'bg-center',
			'badge'       => 'Constituency Growth',
			'title'       => 'Community Empowerment',
			'description' => 'Auditing developments and overseeing local projects through transparent CDF initiatives.',
			'cta_label'   => 'Audit Map',
			'cta_url'     => '/cdf-tracker/',
		),
		array(
			'id'          => 'slide-3',
			'image'       => '',
			'image_id'    => 0,
			'position'    => 'bg-center',
			'badge'       => 'Leadership Legacy',
			'title'       => 'A Vision for Whange',
			'description' => 'Championing mining and environmental protection policies to safeguard community livelihoods.',
			'cta_label'   => 'Read Biography',
			'cta_url'     => '/biography/',
		),
	);
}

function molokele_tools_get_hero_slides() {
	$slides = get_option( 'molokele_hero_slides', null );
	if ( ! is_array( $slides ) || empty( $slides ) ) {
		$slides = molokele_tools_default_hero_slides();
	}
	return rest_ensure_response( $slides );
}

function molokele_tools_save_hero_slides( $request ) {
	$params = $request->get_json_params();
	if ( ! is_array( $params ) ) {
		return new WP_Error( 'molokele_invalid_slides', 'Expected an array of slides.', array( 'status' => 400 ) );
	}

	$clean = array();
	foreach ( $params as $slide ) {
		if ( ! is_array( $slide ) ) {
			continue;
		}
		$clean[] = array(
			'id'          => sanitize_text_field( $slide['id'] ?? uniqid( 'slide-' ) ),
			'image'       => esc_url_raw( $slide['image'] ?? '' ),
			'image_id'    => absint( $slide['image_id'] ?? 0 ),
			'position'    => in_array( $slide['position'] ?? '', array( 'bg-top', 'bg-center', 'bg-bottom' ), true )
				? $slide['position']
				: 'bg-center',
			'badge'       => sanitize_text_field( $slide['badge'] ?? '' ),
			'title'       => sanitize_text_field( $slide['title'] ?? '' ),
			'description' => sanitize_textarea_field( $slide['description'] ?? '' ),
			'cta_label'   => sanitize_text_field( $slide['cta_label'] ?? '' ),
			'cta_url'     => esc_url_raw( $slide['cta_url'] ?? '' ),
		);
	}

	update_option( 'molokele_hero_slides', $clean );
	return rest_ensure_response(
		array(
			'success' => true,
			'slides'  => $clean,
		)
	);
}
