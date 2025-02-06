<?php

function aham_enqueue_styles() {
    wp_enqueue_style('aham-style', get_stylesheet_uri());
}

add_action('wp_enqueue_scripts', 'aham_enqueue_styles');

add_theme_support( 'post-thumbnails' );

function aham_wp_title( $title, $sep ) {
    return $title . 'Aham';
}

add_filter( 'wp_title', 'aham_wp_title', 10, 2 );