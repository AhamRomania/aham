<?php get_header(); ?>

<?php the_post(); ?>

<main>
    <div class="wrapper">

        <article>

            <h3><?php the_title(); ?></h3>

            <div class="post-content">
                <?php the_content(); ?>
            </div>

            <div class="post-tags">
                <?php the_tags('', ', ', ''); ?>
            </div>

        </article>

        <div class="post-navigation">
            <div class="prev-post"><?php previous_post_link('%link', '← %title'); ?></div>
            <div class="next-post"><?php next_post_link('%link', '%title →'); ?></div>
        </div>

        <div class="recent-posts-container">
            <div class="recent-posts-title">
                Alte Postări
            </div>
            <?php
            $recent_posts = wp_get_recent_posts(array(
                'numberposts' => 5,
                'post_status' => 'publish'
            ));
            
            echo '<ul class="recent-posts">';
            foreach ($recent_posts as $post) {
                echo '<li>';
                echo '<a href="' . get_permalink($post["ID"]) . '">' . esc_html($post["post_title"]) . '</a>';
                echo '<em>'.get_the_date('', $post).'</em>';
                echo '</li>';
            }
            echo '</ul>';
            ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>