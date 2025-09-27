// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    // Initialize Masonry before lazyload so afterLoad can relayout reliably
    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
            // Relayout Masonry after any lazy item loads (works for img and div)
            if ($grid && $grid.masonry) {
                $grid.masonry('layout');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });

    // Ensure Bootstrap carousels are initialized and relayout after slide
    var hasBootstrapCarousel = !!($.fn && $.fn.carousel);
    if (hasBootstrapCarousel) {
        $('.carousel').carousel();
        $('.carousel').on('slid.bs.carousel', function () {
            if ($grid && $grid.masonry) {
                $grid.masonry('layout');
            }
        });
    } else {
        console.warn('[carousel] Bootstrap carousel plugin not found; using manual fallback.');
    }

    // Manual fallback helpers
    function setSlide($c, index) {
        var $items = $c.find('.carousel-item');
        if ($items.length === 0) return;
        index = ((index % $items.length) + $items.length) % $items.length;
        $items.removeClass('active').eq(index).addClass('active');
        var $ind = $c.find('.carousel-indicators [data-slide-to]');
        $ind.removeClass('active').filter('[data-slide-to="' + index + '"]').addClass('active');
        if ($grid && $grid.masonry) { $grid.masonry('layout'); }
    }
    function nextIndex($c, delta) {
        var $items = $c.find('.carousel-item');
        var cur = $items.index($items.filter('.active'));
        if (cur < 0) cur = 0;
        return cur + delta;
    }

    // Defensive bindings: controls and indicators
    $('.carousel').each(function() {
        var $c = $(this);
        $c.find('.carousel-control-prev').on('click', function(e) {
            e.preventDefault();
            if (hasBootstrapCarousel) { $c.carousel('prev'); }
            else { setSlide($c, nextIndex($c, -1)); }
        });
        $c.find('.carousel-control-next').on('click', function(e) {
            e.preventDefault();
            if (hasBootstrapCarousel) { $c.carousel('next'); }
            else { setSlide($c, nextIndex($c, 1)); }
        });
        $c.find('.carousel-indicators [data-slide-to]').on('click', function(e) {
            e.preventDefault();
            var idx = parseInt($(this).attr('data-slide-to'), 10);
            if (isNaN(idx)) return;
            if (hasBootstrapCarousel) { $c.carousel(idx); }
            else { setSlide($c, idx); }
        });
    });
})
