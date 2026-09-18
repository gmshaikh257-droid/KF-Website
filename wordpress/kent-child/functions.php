<?php
/**
 * Kent Furniture child theme.
 * Blocksy parent. Keep all customisation here so parent updates are safe.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'KENT_WHATSAPP', '923357779940' );
define( 'KENT_MAPS', 'https://maps.app.goo.gl/CNA7s5AZDUFJVrna7' );

/** Load parent + child styles */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'blocksy-parent', get_template_directory_uri() . '/style.css' );
	wp_enqueue_style(
		'kent-child',
		get_stylesheet_directory_uri() . '/style.css',
		[ 'blocksy-parent' ],
		wp_get_theme()->get( 'Version' )
	);
}, 20 );

/** Google Fonts — Archivo, IBM Plex Sans, IBM Plex Mono */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'kent-fonts',
		'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap',
		[], null
	);
} );

/** WhatsApp deep link with the product name and code pre-filled */
function kent_wa_link( $text = '' ) {
	$text = $text ?: 'Hello Kent Furniture, I would like to enquire.';
	return 'https://wa.me/' . KENT_WHATSAPP . '?text=' . rawurlencode( $text );
}

/** Product code + dimensions under the title on shop and product pages */
add_action( 'woocommerce_after_shop_loop_item_title', function () {
	global $product;
	$sku = $product->get_sku();
	$w = $product->get_width(); $h = $product->get_height(); $d = $product->get_length();

	if ( $sku ) {
		echo '<div class="kent-code">' . esc_html( $sku ) . '</div>';
	}
	if ( $w && $h && $d ) {
		printf(
			'<div class="kent-dim">%s &times; %s &times; %s in &nbsp;&middot;&nbsp; W &times; H &times; D</div>',
			esc_html( $w ), esc_html( $h ), esc_html( $d )
		);
	}
	if ( $product->get_price() ) {
		echo '<span class="kent-cod">Delivered &middot; COD</span>';
	}
}, 6 );

/**
 * Two buying journeys.
 * Products with a price behave normally (cart + checkout).
 * Products with no price show a WhatsApp enquiry button instead.
 */
add_filter( 'woocommerce_is_purchasable', function ( $purchasable, $product ) {
	return $product->get_price() === '' ? false : $purchasable;
}, 10, 2 );

add_action( 'woocommerce_single_product_summary', function () {
	global $product;
	if ( $product->get_price() !== '' ) return;

	$msg = sprintf(
		'Hello Kent Furniture, I am interested in %s (%s). Please share details and price.',
		$product->get_name(), $product->get_sku()
	);
	printf(
		'<p class="price">Price on request</p><a class="kent-wa-btn" target="_blank" rel="noopener" href="%s">Enquire on WhatsApp</a>',
		esc_url( kent_wa_link( $msg ) )
	);
}, 30 );

/** Sticky WhatsApp button + mobile bottom bar */
add_action( 'wp_footer', function () {
	$wa  = esc_url( kent_wa_link() );
	$map = esc_url( KENT_MAPS );
	$shop = esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' ) );
	$cart = esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/cart/' ) );
	echo <<<HTML
<a class="kent-fab" href="{$wa}" target="_blank" rel="noopener" aria-label="WhatsApp">
<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2z"/></svg></a>
<nav class="kent-mobile-bar" aria-label="Quick actions">
<a href="{$shop}">Shop</a>
<a class="is-wa" href="{$wa}" target="_blank" rel="noopener">WhatsApp</a>
<a href="{$map}" target="_blank" rel="noopener">Visit</a>
<a href="{$cart}">Cart</a>
</nav>
HTML;
} );

/** Currency display: PKR with no decimals */
add_filter( 'wc_get_price_decimals', fn() => 0 );
