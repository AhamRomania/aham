<?php get_header(); ?>

<main>
    <div class="wrapper">
        <h2>Latest Posts</h2>
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article>
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="post-thumbnail">
                        <?php the_post_thumbnail('full'); ?>
                    </div>
                <?php endif; ?>
                <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                <p><?php echo get_the_date(); ?></p>
            </article>
        <?php endwhile;
        the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => '← Pagina precedentă',
            'next_text' => 'Următoarea pagină →',
        ));
        else : ?>
            <p>No posts found.</p>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>