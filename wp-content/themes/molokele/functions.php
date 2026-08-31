<?php
/**
 * Molokele theme bootstrap.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dark mode, flash-free: this has to be an inline, synchronous script
 * printed before the stylesheet link tag, so the .dark class lands on
 * <html> before the browser paints anything. A cookie means "the visitor
 * chose a mode explicitly" and always wins; with no cookie we fall back to
 * the OS preference. Priority 0 puts this ahead of wp_print_styles
 * (priority 8), which is what actually prints the enqueued stylesheet.
 */
add_action(
	'wp_head',
	function () {
		?>
		<link rel="icon" type="image/svg+xml" href="<?php echo esc_url( get_stylesheet_directory_uri() . '/favicon.svg' ); ?>" />
		<link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url( get_stylesheet_directory_uri() . '/favicon-32x32.png' ); ?>" />
		<link rel="icon" type="image/png" sizes="16x16" href="<?php echo esc_url( get_stylesheet_directory_uri() . '/favicon-16x16.png' ); ?>" />
		<link rel="shortcut icon" href="<?php echo esc_url( get_stylesheet_directory_uri() . '/favicon.ico' ); ?>" />
		<link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url( get_stylesheet_directory_uri() . '/apple-touch-icon.png' ); ?>" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,100..900;1,100..900&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap" />
		<script>
			(function () {
				try {
					var m = document.cookie.match(/(?:^|; )molokele_theme=(dark|light)/);
					var theme = m ? m[1] : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
					if (theme === 'dark') {
						document.documentElement.classList.add('dark');
					}
				} catch (e) {}
			})();
		</script>
		<?php
	},
	0
);

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
 * React Fast Refresh needs its "preamble" (the runtime that
 * @vitejs/plugin-react's JSX transform checks for) installed on window
 * before any transformed component module executes. Vite injects this
 * automatically into an index.html it controls, but WP prints the script
 * tags itself, so it has to be added by hand — and early, since it's a
 * module script and must run before the vite-client/app module scripts.
 */
add_action(
	'wp_head',
	function () {
		if ( ! molokele_is_vite_dev() ) {
			return;
		}
		?>
		<script type="module">
			import RefreshRuntime from "http://localhost:5173/@react-refresh";
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
				'pageSlug'     => is_singular()
					? get_post_field( 'post_name', get_queried_object_id() )
					: ( is_category() ? get_queried_object()->slug : ( is_home() ? 'blog' : '' ) ),
				'isSinglePost' => is_singular( 'post' ),
				'isPage'       => is_page(),
				'isFrontPage'  => is_front_page(),
				'is404'        => is_404(),
			)
		);
	},
	20
);

/**
 * Register a taxonomy for grouping media library images into named galleries
 * (e.g. "home", "about", "biography", "leadership"), queryable from the React
 * front end via the REST API instead of hardcoding image paths in the theme.
 */
add_action(
	'init',
	function () {
		register_taxonomy(
			'site_gallery',
			'attachment',
			array(
				'labels'            => array(
					'name'          => __( 'Site Galleries', 'molokele' ),
					'singular_name' => __( 'Site Gallery', 'molokele' ),
				),
				'public'            => true,
				'hierarchical'      => false,
				'show_in_rest'      => true,
				'rest_base'         => 'site_gallery',
				'show_admin_column' => true,
				'show_ui'           => true,
			)
		);
	}
);

/**
 * Allow filtering the media REST endpoint by gallery term slug directly,
 * e.g. /wp-json/wp/v2/media?site_gallery_slug=biography — avoids a round
 * trip to resolve the term ID first.
 */
add_action(
	'rest_api_init',
	function () {
		register_rest_field(
			'attachment',
			'site_gallery_slugs',
			array(
				'get_callback' => function ( $object ) {
					$terms = get_the_terms( $object['id'], 'site_gallery' );
					if ( ! $terms || is_wp_error( $terms ) ) {
						return array();
					}
					return wp_list_pluck( $terms, 'slug' );
				},
			)
		);
	}
);
add_filter(
	'rest_attachment_query',
	function ( $args, $request ) {
		$slug = $request->get_param( 'site_gallery_slug' );
		if ( $slug ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'site_gallery',
					'field'    => 'slug',
					'terms'    => sanitize_title( $slug ),
				),
			);
		}
		return $args;
	},
	10,
	2
);

/**
 * Register post meta for Press Coverage attribution (publication + byline),
 * exposed via REST so the React frontend can render a "Source" badge without
 * scraping it out of post content.
 */
add_action(
	'init',
	function () {
		register_post_meta(
			'post',
			'source_publication',
			array(
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		register_post_meta(
			'post',
			'source_author',
			array(
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
);

/**
 * Hardening: Hide specific login failure hints (wrong username vs password).
 */
add_filter(
	'login_errors',
	function () {
		return __( 'Invalid login credentials.', 'molokele' );
	}
);

/**
 * SERVER-SIDE SEARCH INDEXING ENGINE
 * Generates a pre-compiled search index stored in a WordPress transient.
 * Automatically updates whenever any post, page, or speech is published, edited, or deleted.
 */
function molokele_build_server_search_index() {
	$query_args = array(
		'post_type'      => array( 'post', 'page' ),
		'post_status'    => 'publish',
		'posts_per_page' => -1,
	);

	$posts = get_posts( $query_args );
	$index = array();

	foreach ( $posts as $p ) {
		$title   = html_entity_decode( wp_strip_all_tags( $p->post_title ), ENT_QUOTES, 'UTF-8' );
		$excerpt = html_entity_decode( wp_strip_all_tags( get_the_excerpt( $p ) ), ENT_QUOTES, 'UTF-8' );
		$link    = get_permalink( $p->ID );

		if ( $p->post_type === 'page' ) {
			if ( strtolower( $title ) === 'home' ) {
				continue;
			}
			$index[] = array(
				'id'           => 'page-' . $p->ID,
				'title'        => $title,
				'excerpt'      => $excerpt,
				'link'         => $link,
				'date'         => '',
				'type'         => 'page',
				'categoryName' => 'Page',
				'categorySlug' => 'page',
				'image'        => get_the_post_thumbnail_url( $p->ID, 'medium' ) ?: null,
				'searchField'  => strtolower( $title . ' ' . $excerpt ),
			);
		} else {
			$categories   = get_the_category( $p->ID );
			$cat_slug     = ! empty( $categories ) ? $categories[0]->slug : 'community-updates';
			$cat_name     = ! empty( $categories ) ? $categories[0]->name : 'News';
			$source_pub   = get_post_meta( $p->ID, 'source_publication', true );
			$source_auth  = get_post_meta( $p->ID, 'source_author', true );
			$formatted_dt = get_the_date( 'j M Y', $p );

			$type = ( 'speeches' === $cat_slug ) ? 'speech' : ( ( 'press-coverage' === $cat_slug ) ? 'press' : 'news' );

			$index[] = array(
				'id'                => 'post-' . $p->ID,
				'title'             => $title,
				'excerpt'           => $excerpt,
				'link'              => $link,
				'date'              => $formatted_dt,
				'type'              => $type,
				'categoryName'      => $cat_name,
				'categorySlug'      => $cat_slug,
				'image'             => get_the_post_thumbnail_url( $p->ID, 'medium' ) ?: null,
				'sourcePublication' => $source_pub ?: null,
				'sourceAuthor'      => $source_auth ?: null,
				'searchField'       => strtolower( $title . ' ' . $excerpt . ' ' . $cat_name . ' ' . $source_pub ),
			);
		}
	}

	// Add core static sections
	$index[] = array(
		'id'           => 'section-cdf',
		'title'        => 'CDF Tracker & Project Audits',
		'excerpt'      => 'Live status updates and map of Constituency Development Fund infrastructure projects in Whange Central.',
		'link'         => home_url( '/cdf-tracker/' ),
		'type'         => 'page',
		'categoryName' => 'CDF Tracker',
		'categorySlug' => 'cdf',
		'searchField'  => 'cdf tracker cdf projects boreholes school infrastructure constituency development fund whange',
	);
	$index[] = array(
		'id'           => 'section-parliament',
		'title'        => 'In Parliament & Legislation',
		'excerpt'      => 'Hansard debates, speech transcripts, gender equality, health policy, and labor conventions.',
		'link'         => home_url( '/in-parliament/' ),
		'type'         => 'page',
		'categoryName' => 'Parliament',
		'categorySlug' => 'parliament',
		'searchField'  => 'in parliament speeches legislation hansard debates health gender labour disability culture',
	);
	$index[] = array(
		'id'           => 'section-biography',
		'title'        => 'Biography & Union Leadership',
		'excerpt'      => 'Read about Hon. Molokele, trade union legacy, education, and advocacy journey.',
		'link'         => home_url( '/biography/' ),
		'type'         => 'page',
		'categoryName' => 'About',
		'categorySlug' => 'biography',
		'searchField'  => 'biography about daniel molokele profile union leadership matabeleland north mp',
	);

	set_transient( 'molokele_search_index', $index, 24 * HOUR_IN_SECONDS );
	return $index;
}

// Re-index automatically whenever posts or pages are created, edited, or deleted
add_action( 'save_post', 'molokele_build_server_search_index' );
add_action( 'delete_post', 'molokele_build_server_search_index' );
add_action( 'trash_post', 'molokele_build_server_search_index' );

// Register REST API Endpoint: GET /wp-json/molokele/v1/search-index
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'molokele/v1',
			'/search-index',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => function () {
					$index = get_transient( 'molokele_search_index' );
					if ( false === $index ) {
						$index = molokele_build_server_search_index();
					}
					return rest_ensure_response( $index );
				},
			)
		);
	}
);

/**
 * Branded preloader overlay, printed as the very first thing after <body>.
 * This is plain server-rendered HTML/CSS — it has to be, since its whole
 * point is covering the gap before the React bundle has even started
 * downloading. main.jsx fades it out once the app has mounted, and
 * PageLoader.js re-shows it the instant an internal link is clicked, so the
 * transition into the *next* page's own copy of this overlay is seamless.
 */
add_action(
	'wp_body_open',
	function () {
		?>
		<div id="molokele-preloader" aria-hidden="true">
			<div class="molokele-preloader__stripe"></div>
			<div class="molokele-preloader__glow"></div>
			<div class="molokele-preloader__mark">Hon. Molokele</div>
			<div class="molokele-preloader__sub">MP Whange Central</div>
			<div class="molokele-preloader__bar"><span></span></div>
		</div>
		<style>
			#molokele-preloader {
				position: fixed;
				inset: 0;
				z-index: 99999;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background: #090D14;
				transition: opacity .45s ease, visibility .45s ease;
			}
			#molokele-preloader.is-hidden {
				opacity: 0;
				visibility: hidden;
				pointer-events: none;
			}
			.molokele-preloader__stripe {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 4px;
				background: linear-gradient(90deg, #044D29 25%, #DCA11D 25% 50%, #C8102E 50% 75%, #000000 75%);
			}
			.molokele-preloader__glow {
				position: absolute;
				inset: 0;
				background: radial-gradient(circle at 50% 45%, rgba(4,77,41,0.35) 0%, rgba(220,161,29,0.18) 40%, rgba(200,16,46,0.12) 70%, transparent 85%);
				pointer-events: none;
			}
			.molokele-preloader__mark {
				position: relative;
				font-family: "Red Hat Display", "Inter", sans-serif;
				font-weight: 900;
				font-size: 1.25rem;
				letter-spacing: 0.16em;
				text-transform: uppercase;
				color: #FFFFFF;
				animation: molokele-preloader-pulse 1.7s ease-in-out infinite;
			}
			.molokele-preloader__sub {
				position: relative;
				font-family: "Red Hat Display", "Inter", sans-serif;
				font-weight: 800;
				font-size: 0.7rem;
				letter-spacing: 0.22em;
				text-transform: uppercase;
				color: #DCA11D;
				margin-top: 0.4rem;
			}
			.molokele-preloader__bar {
				position: relative;
				margin-top: 1.2rem;
				height: 4px;
				width: 160px;
				overflow: hidden;
				border-radius: 999px;
				background: rgba(255,255,255,0.1);
				border: 1px solid rgba(220,161,29,0.25);
			}
			.molokele-preloader__bar span {
				display: block;
				height: 100%;
				width: 50%;
				border-radius: 999px;
				background: linear-gradient(90deg, #044D29, #DCA11D, #C8102E, #000000);
				animation: molokele-preloader-sweep 1.1s ease-in-out infinite;
			}
			@keyframes molokele-preloader-pulse {
				0%, 100% { opacity: 1; }
				50% { opacity: 0.45; }
			}
			@keyframes molokele-preloader-sweep {
				0% { transform: translateX(-130%); }
				100% { transform: translateX(310%); }
			}
			@media (prefers-reduced-motion: reduce) {
				.molokele-preloader__mark,
				.molokele-preloader__bar span {
					animation: none;
				}
			}
		</style>
		<noscript>
			<style>#molokele-preloader { display: none; }</style>
		</noscript>
		<?php
	},
	5
);
