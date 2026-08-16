<?php
/**
 * Plugin Name: Molokele Tools
 * Description: Utility plugin scaffold for Hon. Daniel Molokele (Whange Central MP).
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
 * Register the admin menu and submenu entry points for Molokele Tools.
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

		add_submenu_page(
			'molokele-tools',
			'Overview • Molokele Tools',
			'Overview',
			'manage_options',
			'molokele-tools',
			'molokele_tools_render_admin_page'
		);

		add_submenu_page(
			'molokele-tools',
			'Hero Slider • Molokele Tools',
			'Hero Slider',
			'manage_options',
			'molokele-tools-hero',
			'molokele_tools_render_admin_page'
		);

		add_submenu_page(
			'molokele-tools',
			'CDF Tracker • Molokele Tools',
			'CDF Tracker',
			'manage_options',
			'molokele-tools-cdf',
			'molokele_tools_render_admin_page'
		);

		add_submenu_page(
			'molokele-tools',
			'Photo Gallery • Molokele Tools',
			'Photo Gallery',
			'manage_options',
			'molokele-tools-images',
			'molokele_tools_render_admin_page'
		);

		add_submenu_page(
			'molokele-tools',
			'Display Settings • Molokele Tools',
			'Display Settings',
			'manage_options',
			'molokele-tools-settings',
			'molokele_tools_render_admin_page'
		);
	}
);

/**
 * Render the admin page container.
 */
function molokele_tools_render_admin_page() {
	?>
	<div class="wrap" style="margin-top: 12px; margin-right: 20px;">
		<div id="molokele-tools-root"></div>
	</div>
	<?php
}

/**
 * React Fast Refresh needs its "preamble" installed on window before any
 * transformed component module executes — see the matching wp_head hook in
 * the theme's functions.php for the full explanation. wp-admin prints its
 * own scripts too, so the admin bundle needs the same early injection.
 */
add_action(
	'admin_head',
	function () {
		$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
		if ( strpos( $page, 'molokele-tools' ) === false || ! molokele_tools_is_vite_dev() ) {
			return;
		}
		?>
		<script type="module">
			import RefreshRuntime from "http://localhost:5174/@react-refresh";
			RefreshRuntime.injectIntoGlobalHook(window);
			window.$RefreshReg$ = () => {};
			window.$RefreshSig$ = () => (type) => type;
			window.__vite_plugin_react_preamble_installed__ = true;
		</script>
		<?php
	},
	1
);

/**
 * Enqueue scripts and styles in the admin area.
 */
add_action(
	'admin_enqueue_scripts',
	function ( $hook ) {
		// Only load assets on our plugin pages to avoid conflict with other admin views.
		if ( strpos( $hook, 'molokele-tools' ) === false ) {
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

		$current_page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : 'molokele-tools';
		$current_tab  = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : '';

		wp_localize_script(
			'molokele-tools',
			'molokeleToolsData',
			array(
				'nonce'       => wp_create_nonce( 'wp_rest' ),
				'restUrl'     => esc_url_raw( rest_url( 'molokele/v1/' ) ),
				'adminEmail'  => get_option( 'admin_email' ),
				'initialPage' => $current_page,
				'initialTab'  => $current_tab,
				'siteUrl'     => home_url(),
				'adminUrl'    => admin_url( 'admin.php' ),
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
		'columns'            => '3',
		'shadow'             => 'shadow-md',
		'border_radius'      => 'rounded-sm',
		'autoplay'           => false,
		'autoplay_speed'     => '3000',
		'backdrop_blur'      => 'backdrop-blur-md',
		// Which homepage hero layout renders: 'current' (the live design) or
		// 'alternative' (the editorial gallery slideshow). See Home.jsx and
		// lib/HeroCurrent.jsx / lib/HeroEditorial.jsx in the theme.
		'hero_display_mode' => 'current',
	);

	// Merge saved settings over the defaults so older saved values (from
	// before hero_display_mode existed) still get a valid value.
	$saved    = get_option( 'molokele_gallery_settings', array() );
	$settings = wp_parse_args( is_array( $saved ) ? $saved : array(), $default_settings );
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

/**
 * Register REST API routes for the CDF Tracker page — campaign header,
 * consultation schedule, ward status board, and project-cycle stages.
 * Same public-GET / admin-POST shape as hero-slides above.
 */
add_action(
	'rest_api_init',
	function () {
		$cdf_resources = array(
			'cdf-campaign' => array( 'molokele_tools_get_cdf_campaign', 'molokele_tools_save_cdf_campaign' ),
			'cdf-schedule' => array( 'molokele_tools_get_cdf_schedule', 'molokele_tools_save_cdf_schedule' ),
			'cdf-wards'    => array( 'molokele_tools_get_cdf_wards', 'molokele_tools_save_cdf_wards' ),
			'cdf-stages'   => array( 'molokele_tools_get_cdf_stages', 'molokele_tools_save_cdf_stages' ),
		);

		foreach ( $cdf_resources as $route => $callbacks ) {
			register_rest_route(
				'molokele/v1',
				'/' . $route,
				array(
					// Public: the CDF Tracker page reads these to render —
					// only saving requires admin rights.
					'methods'             => 'GET',
					'callback'            => $callbacks[0],
					'permission_callback' => '__return_true',
				)
			);

			register_rest_route(
				'molokele/v1',
				'/' . $route,
				array(
					'methods'             => 'POST',
					'callback'            => $callbacks[1],
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
		}
	}
);

/**
 * A datetime-local input (<input type="datetime-local">) posts values shaped
 * like "2025-08-14T17:00" — no timezone. The frontend treats every stored
 * value as Harare/CAT time (UTC+2, no DST) when building Date objects and
 * calendar links, so we only need to validate the shape here, not convert it.
 */
function molokele_tools_sanitize_datetime_local( $value, $fallback ) {
	$value = is_string( $value ) ? $value : '';
	if ( preg_match( '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/', $value ) ) {
		return $value;
	}
	return $fallback;
}

/**
 * CDF campaign header + deadline callout.
 */
function molokele_tools_default_cdf_campaign() {
	return array(
		'announcement_badge'    => 'Parliament Announcement • August CDF Month',
		'campaign_badge'        => '2025 Campaign',
		'title'                 => 'CDF 2025 Project Proposal Campaign',
		'description'           => 'The Parliament of Zimbabwe has officially opened the call for 2025 Constituency Development Fund (CDF) project proposals for August. All residents, ward committees, and civil society groups in Whange Central are invited to participate in the upcoming consultation meetings.',
		'deadline_label'        => 'Final Submission Deadline',
		'deadline_datetime_iso' => '2025-08-31T17:00',
		'deadline_note'         => 'Submit completed ward proposal forms to the Whange Central Constituency Office.',
	);
}

function molokele_tools_get_cdf_campaign() {
	$defaults = molokele_tools_default_cdf_campaign();
	$campaign = get_option( 'molokele_cdf_campaign', null );
	if ( ! is_array( $campaign ) || empty( $campaign ) ) {
		$campaign = $defaults;
	}
	return rest_ensure_response( wp_parse_args( $campaign, $defaults ) );
}

function molokele_tools_save_cdf_campaign( $request ) {
	$params   = $request->get_json_params();
	$params   = is_array( $params ) ? $params : array();
	$defaults = molokele_tools_default_cdf_campaign();

	$clean = array(
		'announcement_badge'    => sanitize_text_field( $params['announcement_badge'] ?? $defaults['announcement_badge'] ),
		'campaign_badge'        => sanitize_text_field( $params['campaign_badge'] ?? $defaults['campaign_badge'] ),
		'title'                 => sanitize_text_field( $params['title'] ?? $defaults['title'] ),
		'description'           => sanitize_textarea_field( $params['description'] ?? $defaults['description'] ),
		'deadline_label'        => sanitize_text_field( $params['deadline_label'] ?? $defaults['deadline_label'] ),
		'deadline_datetime_iso' => molokele_tools_sanitize_datetime_local( $params['deadline_datetime_iso'] ?? '', $defaults['deadline_datetime_iso'] ),
		'deadline_note'         => sanitize_textarea_field( $params['deadline_note'] ?? $defaults['deadline_note'] ),
	);

	update_option( 'molokele_cdf_campaign', $clean );
	return rest_ensure_response(
		array(
			'success'  => true,
			'campaign' => $clean,
		)
	);
}

/**
 * CDF consultation schedule. The deadline itself is deliberately NOT
 * duplicated here — it already has its own callout box in the campaign
 * header, and repeating it as a 7th grid card is what orphaned a lone card
 * in the last row.
 */
function molokele_tools_default_cdf_schedule() {
	return array(
		array(
			'id'              => 'evt-1',
			'event'           => 'CDF Executive Committee Meeting',
			'datetime_iso'    => '2025-08-14T17:00',
			'duration_minutes' => 120,
			'type'            => 'Executive Meeting',
			'is_whatsapp'     => false,
			'icon'            => 'users2',
			'status_override' => 'auto',
		),
		array(
			'id'              => 'evt-2',
			'event'           => 'CDF Implementation Committee Meeting',
			'datetime_iso'    => '2025-08-15T11:00',
			'duration_minutes' => 120,
			'type'            => 'Committee Meeting',
			'is_whatsapp'     => false,
			'icon'            => 'clipboard-check',
			'status_override' => 'auto',
		),
		array(
			'id'              => 'evt-3',
			'event'           => 'Launch of Online Consultations (WhatsApp Live)',
			'datetime_iso'    => '2025-08-15T19:00',
			'duration_minutes' => 120,
			'type'            => 'WhatsApp Live Online',
			'is_whatsapp'     => true,
			'icon'            => 'message-square',
			'status_override' => 'auto',
		),
		array(
			'id'              => 'evt-4',
			'event'           => '2nd Online Consultation (WhatsApp Live)',
			'datetime_iso'    => '2025-08-18T19:00',
			'duration_minutes' => 120,
			'type'            => 'WhatsApp Live Online',
			'is_whatsapp'     => true,
			'icon'            => 'message-square',
			'status_override' => 'auto',
		),
		array(
			'id'              => 'evt-5',
			'event'           => '3rd Online Consultation (WhatsApp Live)',
			'datetime_iso'    => '2025-08-21T19:00',
			'duration_minutes' => 120,
			'type'            => 'WhatsApp Live Online',
			'is_whatsapp'     => true,
			'icon'            => 'message-square',
			'status_override' => 'auto',
		),
		array(
			'id'              => 'evt-6',
			'event'           => 'CDF Public Consultation Town Hall Meeting',
			'datetime_iso'    => '2025-08-22T13:00',
			'duration_minutes' => 120,
			'type'            => 'Public Town Hall',
			'is_whatsapp'     => false,
			'icon'            => 'users',
			'status_override' => 'auto',
		),
	);
}

function molokele_tools_get_cdf_schedule() {
	$schedule = get_option( 'molokele_cdf_schedule', null );
	if ( ! is_array( $schedule ) || empty( $schedule ) ) {
		$schedule = molokele_tools_default_cdf_schedule();
	}
	return rest_ensure_response( $schedule );
}

function molokele_tools_save_cdf_schedule( $request ) {
	$params = $request->get_json_params();
	if ( ! is_array( $params ) ) {
		return new WP_Error( 'molokele_invalid_schedule', 'Expected an array of schedule events.', array( 'status' => 400 ) );
	}

	$allowed_icons    = array( 'users2', 'clipboard-check', 'message-square', 'users', 'clock', 'hammer', 'bell', 'clipboard-list', 'refresh-cw' );
	$allowed_statuses = array( 'auto', 'completed', 'cancelled', 'postponed' );

	$clean = array();
	foreach ( $params as $event ) {
		if ( ! is_array( $event ) ) {
			continue;
		}
		$clean[] = array(
			'id'               => sanitize_text_field( $event['id'] ?? uniqid( 'evt-' ) ),
			'event'            => sanitize_text_field( $event['event'] ?? '' ),
			'datetime_iso'     => molokele_tools_sanitize_datetime_local( $event['datetime_iso'] ?? '', '2025-08-01T09:00' ),
			'duration_minutes' => absint( $event['duration_minutes'] ?? 120 ) ?: 120,
			'type'             => sanitize_text_field( $event['type'] ?? '' ),
			'is_whatsapp'      => ! empty( $event['is_whatsapp'] ),
			'icon'             => in_array( $event['icon'] ?? '', $allowed_icons, true ) ? $event['icon'] : 'bell',
			'status_override'  => in_array( $event['status_override'] ?? '', $allowed_statuses, true ) ? $event['status_override'] : 'auto',
		);
	}

	update_option( 'molokele_cdf_schedule', $clean );
	return rest_ensure_response(
		array(
			'success'  => true,
			'schedule' => $clean,
		)
	);
}

/**
 * Ward-by-ward CDF status board.
 */
function molokele_tools_default_cdf_wards() {
	return array(
		array( 'ward' => 'Ward 1', 'place' => 'Chibondo', 'status' => 'complete', 'note' => 'Solar-powered borehole at Megawatts Primary School — operational, serving pupils and residents.' ),
		array( 'ward' => 'Ward 4', 'place' => 'Baghdad', 'status' => 'complete', 'note' => 'Fully installed and delivering fresh water since February.' ),
		array( 'ward' => 'Ward 5', 'place' => 'Empumalanga', 'status' => 'mp-funded', 'note' => 'Installation stalled when CDF funds ran out — the MP personally covered the outstanding US$2,000 to finish the job.' ),
		array( 'ward' => 'Ward 6', 'place' => 'Phase Four', 'status' => 'complete', 'note' => 'Installed and operational, easing water challenges for local residents.' ),
		array( 'ward' => 'Ward 14', 'place' => 'Ngumija', 'status' => 'pending', 'note' => 'Water scarcity remains severe. Initial CDF funds were exhausted — the office is now sourcing external funding.' ),
	);
}

function molokele_tools_get_cdf_wards() {
	$wards = get_option( 'molokele_cdf_wards', null );
	if ( ! is_array( $wards ) || empty( $wards ) ) {
		$wards = molokele_tools_default_cdf_wards();
	}
	return rest_ensure_response( $wards );
}

function molokele_tools_save_cdf_wards( $request ) {
	$params = $request->get_json_params();
	if ( ! is_array( $params ) ) {
		return new WP_Error( 'molokele_invalid_wards', 'Expected an array of wards.', array( 'status' => 400 ) );
	}

	$allowed_statuses = array( 'complete', 'mp-funded', 'pending' );

	$clean = array();
	foreach ( $params as $ward ) {
		if ( ! is_array( $ward ) ) {
			continue;
		}
		$clean[] = array(
			'ward'   => sanitize_text_field( $ward['ward'] ?? '' ),
			'place'  => sanitize_text_field( $ward['place'] ?? '' ),
			'status' => in_array( $ward['status'] ?? '', $allowed_statuses, true ) ? $ward['status'] : 'pending',
			'note'   => sanitize_textarea_field( $ward['note'] ?? '' ),
		);
	}

	update_option( 'molokele_cdf_wards', $clean );
	return rest_ensure_response(
		array(
			'success' => true,
			'wards'   => $clean,
		)
	);
}

/**
 * 5-stage CDF project cycle timeline.
 */
function molokele_tools_default_cdf_stages() {
	return array(
		array( 'icon' => 'users2', 'title' => 'Ward Development Committee Meetings', 'body' => 'Councillors, PR reps, and ward committees convene to open the project cycle.' ),
		array( 'icon' => 'clipboard-list', 'title' => 'Public Consultations & Resident Briefs', 'body' => 'Communities are briefed directly and given the chance to raise concerns before drilling starts.' ),
		array( 'icon' => 'hammer', 'title' => 'Borehole Drilling & Solar Installation', 'body' => 'Jimmy Jimmy Borehole Company carries out the physical works, ward by ward.' ),
		array( 'icon' => 'clipboard-check', 'title' => 'Project Review & Technical Audits', 'body' => "The MP's office and contractor jointly verify completed work against what was promised." ),
		array( 'icon' => 'refresh-cw', 'title' => 'Feedback & Next-Cycle Proposals', 'body' => "Lessons from this cycle — including funding gaps — feed directly into next year's CDF proposal." ),
	);
}

function molokele_tools_get_cdf_stages() {
	$stages = get_option( 'molokele_cdf_stages', null );
	if ( ! is_array( $stages ) || empty( $stages ) ) {
		$stages = molokele_tools_default_cdf_stages();
	}
	return rest_ensure_response( $stages );
}

function molokele_tools_save_cdf_stages( $request ) {
	$params = $request->get_json_params();
	if ( ! is_array( $params ) ) {
		return new WP_Error( 'molokele_invalid_stages', 'Expected an array of stages.', array( 'status' => 400 ) );
	}

	$allowed_icons = array( 'users2', 'clipboard-check', 'message-square', 'users', 'clock', 'hammer', 'bell', 'clipboard-list', 'refresh-cw' );

	$clean = array();
	foreach ( $params as $stage ) {
		if ( ! is_array( $stage ) ) {
			continue;
		}
		$clean[] = array(
			'icon'  => in_array( $stage['icon'] ?? '', $allowed_icons, true ) ? $stage['icon'] : 'bell',
			'title' => sanitize_text_field( $stage['title'] ?? '' ),
			'body'  => sanitize_textarea_field( $stage['body'] ?? '' ),
		);
	}

	update_option( 'molokele_cdf_stages', $clean );
	return rest_ensure_response(
		array(
			'success' => true,
			'stages'  => $clean,
		)
	);
}
