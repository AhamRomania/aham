<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Blog - Aham</title>
    <link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <?php wp_head(); ?>
</head>

<body>

<header>
    <div class="wrapper">

        <a href="/">
            <img 
                src="<?php echo get_template_directory_uri(); ?>/logo.svg"
                width="42"
                height="42"
                alt="Aham Logo"
            />
        </a>
        
        <div class="flex"></div>

        <nav>
            <li><a href="/tehnic">Tehnic</a></li>
            <li><a href="/comunitate">Comunitate</a></li>
        </nav>
    </div>
</header>