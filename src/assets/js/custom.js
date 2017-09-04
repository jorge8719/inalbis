"use strict";

/*Proyect JS*/
var app = app || {};
app.commons = app.commons || {};
app.commons.init = (function () {
    var init = function () {
        //Parallax
        this.parallax = function () {
            var window_width = $(window).width();
            $('.js-parallax-trigger').each(function (i) {
                var $this = $(this);
                var updateParallax = function (initial) {
                    var container_height;
                    if (window_width < 601) {
                        container_height = ($this.height() > 0) ? $this.height() : $this.children('img').height();
                    } else {
                        container_height = ($this.height() > 0) ? $this.height() : 500;
                    }
                    var $img = $this.children('img').first();
                    var img_height = $img.height();
                    var parallax_dist = img_height - container_height;
                    var bottom = $this.offset().top + container_height;
                    var top = $this.offset().top;
                    var scrollTop = $(window).scrollTop();
                    var windowHeight = window.innerHeight;
                    var windowBottom = scrollTop + windowHeight;
                    var percentScrolled = (windowBottom - top) / (container_height + windowHeight);
                    var parallax = Math.round((parallax_dist * percentScrolled));
                    if (initial) {
                        $img.css('display', 'block');
                    }
                    if ((bottom > scrollTop) && (top < (scrollTop + windowHeight))) {
                        $img.css('transform', 'translate3D(-50%,' + parallax + 'px, 0) translateZ(0)');
                    }
                };
                // Wait for image load
                $this.children('img').one('load', function () {
                    updateParallax(true);
                }).each(function () {
                    if (this.complete)
                        $(this).trigger('load');
                });

                $(window).on('load', function () {
                    window_width = $(window).width();
                    updateParallax(false);
                });
                $(window).on('scroll', function () {
                    window_width = $(window).width();
                    updateParallax(false);
                });
                $(window).on('resize', function () {
                    window_width = $(window).width();
                    updateParallax(false);
                });
            });
        };

        //Efecto en los botones
        this.btnEffect = function () {
            $(document).on('click', '.c-btn', function (e) {
                var $div = $('<div/>'),
                    btnOffset = $(this).offset(),
                    xPos = e.pageX - btnOffset.left,
                    yPos = e.pageY - btnOffset.top;

                $div.addClass('c-btn__effect');
                var $ripple = $(".c-button__effect");

                $ripple.css("height", $(this).height());
                $ripple.css("width", $(this).height());
                $div.css({
                    top: yPos - ($ripple.height() / 2),
                    left: xPos - ($ripple.width() / 2),
                    background: 'rgba(255, 255, 255, 0.4)'
                }).appendTo($(this));

                window.setTimeout(function () {
                    $div.remove();
                }, 1500);
            });
        };

        //Tabs
        this.tabs = function () {
            $('.m-tabs__link').on('click', function (e) {
                e.preventDefault();

                var $triggerParent = $(this).parents('.m-tabs');

                var tab_id = $(this).attr('data-tab-nav');


                $('.m-tabs__link', $triggerParent).removeClass('is-active');

                $('[data-tab-index]', $triggerParent).removeClass('is-active');

                $(this).addClass('is-active');

                $("#" + tab_id).addClass('is-active');
                $('[data-tab-index="' + tab_id + '"]').addClass('is-active');

            });
        };

        //Cookies
        this.cookies = function () {
            var x = readCookie('conditions');
            if (!x) {
                $('body').addClass('cookies--is-active');
            }
            $('.cookies__btn').on('click', function (e) {
                e.stopImmediatePropagation();
                if (!x) {
                    createCookie('conditions', 'true', 365);
                    $('body').removeClass('cookies--is-active');
                }
            });
        };


        this.checkDevice = function () {
            if ((/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) && screen.width < 767) {
                $('body').addClass('is-mobile');
                return 'isMobile';
            } else if ((/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) && screen.width > 766) {
                $('body').addClass('is-mobile');
                return 'isMobile';
            } else {
                $('body').addClass('is-desktop');
            }
        };

    };
    return new init();
})();


$(document).ready(function () {
    app.commons.init.parallax();
    app.commons.init.btnEffect();
    app.commons.init.tabs();
    app.commons.init.cookies();
    app.commons.init.checkDevice();

});











