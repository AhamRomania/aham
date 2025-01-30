<?php get_header(); ?>

<?php the_post(); ?>

<main>
    <div class="wrapper">
        
        <div class="reading-container">
            <article>

                <div class="post-title">
                    <?php the_title(); ?>
                </div>

                <div class="post-image">
                    <?php
                    if (has_post_thumbnail()) :
                        // Get the post's featured image (set custom size)
                        the_post_thumbnail('large'); // You can change the size (e.g., 'medium', 'full', or custom size)
                    endif;
                    ?>
                </div>

                <div class="post-content">
                    <?php the_content(); ?>
                </div>

                <div class="post-tags">
                    <?php the_tags('', ', ', ''); ?>
                </div>

            </article>
        </div>

        <div class="post-navigation">
            <div class="prev-post">
                <?php
                    $previous_post = get_previous_post();
                    if ($previous_post) {
                        $title = get_the_title($previous_post->ID); // Get the title of the previous post
                        $trimmed_title = wp_trim_words($title, 10, '...'); // Trim the title to 10 words
                        echo '<a title="'.$title.'" href="' . get_permalink($previous_post->ID) . '">← ' . $trimmed_title . '</a>';
                    }
                ?>
            </div>
            <div class="next-post">
                <?php
                    $next_post = get_next_post();
                    if ($next_post) {
                        $title = get_the_title($next_post->ID); // Get the title of the previous post
                        $trimmed_title = wp_trim_words($title, 10, '...'); // Trim the title to 10 words
                        echo '<a title="'.$title.'" href="' . get_permalink($next_post->ID) . '">' . $trimmed_title . ' →</a>';
                    }
                ?>
            </div>
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