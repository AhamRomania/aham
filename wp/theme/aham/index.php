<?php get_header(); ?>

<main>
    <div class="wrapper">
        
        <?php
            if (have_posts()) :
            
            echo '<div class="reading-container posts">';
            while (have_posts()) : the_post();
        ?>

            <a href="<?php the_permalink(); ?>">
                <article>
                    <div class="post-image">
                        <?php
                        if (has_post_thumbnail()) :
                            // Get the post's featured image (set custom size)
                            the_post_thumbnail('large'); // You can change the size (e.g., 'medium', 'full', or custom size)
                        endif;
                        ?>
                    </div>
                    <h3><?php the_title(); ?></h3>
                </article>
            </a>

        <?php endwhile;

        echo '</div>';

        the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => '[ ← ]',
            'next_text' => '[ → ]',
        ));
        else : ?>
            <p>No posts found.</p>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>