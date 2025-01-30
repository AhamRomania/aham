<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?php wp_title('|', true, 'right'); ?></title>
    <?php if (is_single()) : ?>
    <meta property="og:type" content="article" />
    <meta property="og:title" content="<?php single_post_title(); ?>" />
    <meta property="og:description" content="<?php echo get_the_excerpt(); ?>" />
    <meta property="og:url" content="<?php the_permalink(); ?>" />
    <meta property="og:image" content="<?php echo get_the_post_thumbnail_url(null, 'full'); ?>" />
    <meta property="og:site_name" content="<?php bloginfo('name'); ?>" />
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php single_post_title(); ?>">
    <meta name="twitter:description" content="<?php echo get_the_excerpt(); ?>">
    <meta name="twitter:image" content="<?php echo get_the_post_thumbnail_url(null, 'full'); ?>">
    <?php endif; ?>
    <link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <?php wp_head(); ?>
</head>

<body>

<header>
    <div class="wrapper">
        <a href="/">
            <img 
                src="<?php echo get_template_directory_uri(); ?>/assets/logo.svg"
                width="42"
                height="42"
                alt="Aham Logo"
            />
        </a>
        <div class="flex"></div>
        <nav>
            <?php 
                wp_list_categories(array(
                    'title_li'   => '',
                    'orderby'    => 'name',
                    'show_count' => false,
                    'exclude'    => '',
                    'hide_empty' => true,
                ));
            ?>
            <li><a href="https://aham.ro?uiref=top_button">Bazar</a></li>
        </nav>
    </div>
</header>