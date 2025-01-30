<?php

function mytheme_enqueue_styles() {
    wp_enqueue_style('mytheme-style', get_stylesheet_uri());
}

add_action('wp_enqueue_scripts', 'mytheme_enqueue_styles');

add_theme_support( 'post-thumbnails' );

function set_one_post_per_page_for_testing($query) {
    if (!is_admin() && $query->is_main_query()) {
        // Limit to 1 post per page
        $query->set('posts_per_page', 1);
    }
}
add_action('pre_get_posts', 'set_one_post_per_page_for_testing');