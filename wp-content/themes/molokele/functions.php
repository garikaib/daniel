<?php
/**
 * Molokele theme bootstrap.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if the Vite dev server is running.
 */
function molokele_is_vite_dev() {
	static $is_dev = null;
	if ( null !== $is_dev ) {
		return $is_dev;
	}

	if ( defined( 'MOLOKELE_VITE_DEV' ) ) {
		$is_dev = MOLOKELE_VITE_DEV;
		return $is_dev;
	}

	// Inside DDEV/Docker, the host is host.docker.internal. On local machine, it's 127.0.0.1.
	$host = 'host.docker.internal';
	if ( ! gethostbyname( $host ) || gethostbyname( $host ) === $host ) {
		$host = '127.0.0.1';
	}

	$connection = @fsockopen( $host, 5173, $errno, $errstr, 0.05 );
	if ( $connection ) {
		fclose( $connection );
		$is_dev = true;
	} else {
		$is_dev = false;
	}

	return $is_dev;
}

/**
 * Enqueue scripts and styles.
 */
add_action(
	'wp_enqueue_scripts',
	function () {
		if ( molokele_is_vite_dev() ) {
			// Enqueue Vite client.
			wp_enqueue_script( 'molokele-vite-client', 'http://localhost:5173/@vite/client', array(), null, false );

			// Enqueue the entry react application.
			wp_enqueue_script( 'molokele-theme', 'http://localhost:5173/wp-content/themes/molokele/src/main.jsx', array( 'molokele-vite-client' ), null, true );
		} else {
			// Production mode.
			$css_path = get_stylesheet_directory() . '/dist/molokele.css';
			$js_path  = get_stylesheet_directory() . '/dist/molokele-theme.es.js';

			if ( file_exists( $css_path ) ) {
				wp_enqueue_style( 'molokele-theme', get_stylesheet_directory_uri() . '/dist/molokele.css', array(), filemtime( $css_path ) );
			}

			if ( file_exists( $js_path ) ) {
				wp_enqueue_script( 'molokele-theme', get_stylesheet_directory_uri() . '/dist/molokele-theme.es.js', array(), filemtime( $js_path ), true );
			}
		}
	}
);

/**
 * Add type="module" to script loader tags for Vite compatibility.
 */
add_filter(
	'script_loader_tag',
	function ( $tag, $handle, $src ) {
		if ( in_array( $handle, array( 'molokele-theme', 'molokele-vite-client' ), true ) ) {
			return '<script type="module" src="' . esc_url( $src ) . '" id="' . esc_attr( $handle ) . '-js"></script>';
		}
		return $tag;
	},
	10,
	3
);

/**
 * Register Navigation Menu Location.
 */
add_action(
	'after_setup_theme',
	function () {
		register_nav_menus(
			array(
				'main-menu' => __( 'Main Menu', 'molokele' ),
			)
		);
	}
);

/**
 * Get formatted menu items by theme location.
 */
function molokele_get_menu_items_by_location( $location ) {
	$locations = get_nav_menu_locations();
	$menu_id   = isset( $locations[ $location ] ) ? $locations[ $location ] : 0;

	if ( ! $menu_id ) {
		return array();
	}

	$menu_items = wp_get_nav_menu_items( $menu_id );
	if ( ! $menu_items ) {
		return array();
	}

	$formatted = array();
	foreach ( $menu_items as $item ) {
		if ( 0 === (int) $item->menu_item_parent ) {
			$formatted[ $item->ID ] = array(
				'id'       => (int) $item->ID,
				'title'    => html_entity_decode( $item->title, ENT_QUOTES, 'UTF-8' ),
				'url'      => $item->url,
				'children' => array(),
			);
		}
	}

	foreach ( $menu_items as $item ) {
		if ( 0 !== (int) $item->menu_item_parent && isset( $formatted[ $item->menu_item_parent ] ) ) {
			$formatted[ $item->menu_item_parent ]['children'][] = array(
				'id'    => (int) $item->ID,
				'title' => html_entity_decode( $item->title, ENT_QUOTES, 'UTF-8' ),
				'url'   => $item->url,
			);
		}
	}

	return array_values( $formatted );
}

/**
 * Pass menu data and page context to the React app.
 */
add_action(
	'wp_enqueue_scripts',
	function () {
		wp_localize_script(
			'molokele-theme',
			'molokeleThemeData',
			array(
				'menuItems'  => molokele_get_menu_items_by_location( 'main-menu' ),
				'currentUrl' => home_url( $_SERVER['REQUEST_URI'] ),
				'pageSlug'   => is_singular() ? get_post_field( 'post_name', get_queried_object_id() ) : ( is_home() ? 'blog' : '' ),
			)
		);
	},
	20
);

/**
 * Hardening: Hide specific login failure hints (wrong username vs password).
 */
add_filter(
	'login_errors',
	function () {
		return 'Invalid login credentials.';
	}
);
