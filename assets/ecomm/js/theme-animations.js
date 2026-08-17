/* ================================================================
   MG JWELLERS — shared animations & interactions
   Runs once header.html + footer.html have been injected
   (fires on the "headerFooterReady" event from include.js).
   Every block below checks that its target elements exist before
   doing anything, so this same file is safe to load on ANY page —
   sections like the carousel, shop-by-metal rotator, catalogue
   slider, and videos will simply do nothing on pages that don't
   have that content (e.g. about.html).
   ================================================================ */
(function () {

    /* ---------- Auto-highlight the current page's nav link ----------
       The header is now shared across every page, so it can no longer
       hardcode which link is "active" — this replaces that by comparing
       each nav link's href against the current page's URL. */
    (function () {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';

        var navLinkGroups = document.querySelectorAll(
            '.navbar-collapse .nav-link, .mobile-menu .menu-list > li > a, .footer_info_sec ~ * a, .bg-secondary a.text-white'
        );

        navLinkGroups.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;
            var linkPage = href.split('/').pop();

            var isMatch = (linkPage === currentPage) ||
                (currentPage === '' && (linkPage === 'index.html' || href === 'https://justudhari.com'));

            if (isMatch) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    })();

    /* ---------- Help widget (headphone icon) click/tap toggle ---------- */
    (function () {
        var widget = document.getElementById('help-widget');
        var icon = widget ? widget.querySelector('.help-icon') : null;
        if (!widget || !icon) return;

        icon.addEventListener('click', function (e) {
            e.stopPropagation();
            widget.classList.toggle('mg-help-open');
        });

        document.addEventListener('click', function (e) {
            if (!widget.contains(e.target)) {
                widget.classList.remove('mg-help-open');
            }
        });
    })();

    /* ---------- Scroll-reveal (adds .mg-in as elements enter view) ---------- */
    (function () {
        var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var groups = [
            {
                els: document.querySelectorAll(
                    '.scheme-card, #shop_by_metal .matterial_block, ' +
                    '#home_collection_shop .product-item, ' +
                    '.bg-secondary .row.pt-5 > .col-lg-6'
                )
            },
            {
                className: 'mg-reveal-title',
                els: document.querySelectorAll('.cstm-section-title')
            },
            {
                className: 'mg-reveal-left',
                els: document.querySelectorAll(
                    '.bg-secondary .row.pt-5 > .col-lg-3:not(.footer_info_sec), ' +
                    '#home_category_shop .row.content > div:nth-child(1) .product-item, ' +
                    '#home_category_shop .row.content > div:nth-child(2) .product-item'
                )
            },
            {
                className: 'mg-reveal-right',
                els: document.querySelectorAll(
                    '.bg-secondary .footer_info_sec, ' +
                    '#home_category_shop .row.content > div:nth-child(3) .product-item, ' +
                    '#home_category_shop .row.content > div:nth-child(4) .product-item, ' +
                    '#catelog_area .catalog.slideshow-container'
                )
            },
            {
                /* Generic opt-in: any page can add class="mg-reveal-auto" to any
                   element to get the same fade/slide-up reveal-on-scroll effect,
                   without needing a page-specific selector added here. */
                els: document.querySelectorAll('.mg-reveal-auto')
            }
        ];

        var allTargets = [];
        groups.forEach(function (group) {
            group.els.forEach(function (el) { allTargets.push({ el: el, className: group.className }); });
        });

        if (allTargets.length === 0) return;

        if (prefersReduced || !('IntersectionObserver' in window)) {
            allTargets.forEach(function (t) { t.el.classList.add('mg-in'); });
            return;
        }

        allTargets.forEach(function (t, i) {
            if (t.className) t.el.classList.add(t.className);
            t.el.style.transitionDelay = (Math.min(i % 4, 3) * 0.08) + 's';
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('mg-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7, rootMargin: '0px 0px -10% 0px' });

        allTargets.forEach(function (t) { io.observe(t.el); });

        setTimeout(function () {
            allTargets.forEach(function (t) {
                if (!t.el.classList.contains('mg-in')) {
                    var rect = t.el.getBoundingClientRect();
                    var inView = rect.top < window.innerHeight && rect.bottom > 0;
                    if (inView) t.el.classList.add('mg-in');
                }
            });
        }, 4000);

        window.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                allTargets.forEach(function (t) { t.el.classList.add('mg-in'); });
            }
        });
    })();

    /* ---------- Shop-by-Material card rotation (index page only) ---------- */
    (function () {
        var wrap = document.querySelector('#shop_by_metal .row.content');
        var cards = document.querySelectorAll('#shop_by_metal .row.content > .col-lg-3 .matterial_block');
        if (!wrap || !cards.length) return;

        var active = 0;
        var timer;

        function update() {
            cards.forEach(function (c, i) {
                c.classList.remove('mg-mat-active', 'mg-mat-adjacent', 'mg-mat-far');
                var isAdjacent = (i === (active + 1) % cards.length) || (i === (active - 1 + cards.length) % cards.length);
                if (i === active) c.classList.add('mg-mat-active');
                else if (isAdjacent) c.classList.add('mg-mat-adjacent');
                else c.classList.add('mg-mat-far');
            });
        }

        function start() {
            timer = setInterval(function () {
                active = (active + 1) % cards.length;
                update();
            }, 1500);
        }

        update();
        if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
            start();
            wrap.addEventListener('mouseenter', function () { clearInterval(timer); });
            wrap.addEventListener('mouseleave', start);
        }
    })();

    /* ---------- Our Catalogue card slider (index page only) ---------- */
    (function () {
        var track = document.querySelector('#catelog_area .catalog.slides');
        if (!track) return;

        function itemOffset() {
            var first = track.firstElementChild;
            var style = getComputedStyle(track);
            var gap = parseFloat(style.columnGap || style.gap || 0) || 0;
            return first.offsetWidth + gap;
        }

        function slide(direction) {
            if (track.dataset.sliding === '1') return;
            track.dataset.sliding = '1';

            var offset = itemOffset();
            var distance = (direction === 'next') ? -offset : offset;

            track.style.transition = 'transform 0.6s cubic-bezier(.22,.9,.32,1)';
            track.style.transform = 'translateX(' + distance + 'px)';

            track.addEventListener('transitionend', function handler() {
                track.removeEventListener('transitionend', handler);

                if (direction === 'next') {
                    track.appendChild(track.firstElementChild);
                } else {
                    track.insertBefore(track.lastElementChild, track.firstElementChild);
                }

                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                void track.offsetWidth;
                track.dataset.sliding = '0';
            }, { once: true });
        }

        var rightBtn = document.getElementById('catalog-slide-right');
        var leftBtn = document.getElementById('catalog-slide-left');
        if (rightBtn) rightBtn.addEventListener('click', function () { slide('next'); });
        if (leftBtn) leftBtn.addEventListener('click', function () { slide('prev'); });

        var touchStartX = 0;
        var touchEndX = 0;

        track.addEventListener('touchstart', function (e) {
            if (window.innerWidth > 767) return;
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            if (window.innerWidth > 767) return;
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) slide('next');
                else slide('prev');
            }
        }, { passive: true });
    })();

    /* ---------- Product/category cards: whole card is clickable (index page only) ---------- */
    (function () {
        var cards = document.querySelectorAll(
            '#home_category_shop .product-item, #home_collection_shop .product-item'
        );

        cards.forEach(function (card) {
            var link = card.querySelector('.btn-default-alt');
            if (!link) return;

            var href = link.getAttribute('href');
            var footer = link.closest('.card-footer');
            if (footer) footer.remove();

            card.style.cursor = 'pointer';
            card.addEventListener('click', function () {
                window.location.href = href;
            });
        });
    })();

    /* ---------- Back to top button (present on every page via footer.html) ---------- */
    (function () {
        var btn = document.querySelector('.back-to-top');
        if (!btn) return;
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    /* ---------- Broken image fallback (only affects images that exist) ---------- */
    (function () {
        var selector =
            '#catelog_area .catalog.slide img, ' +
            '#home_category_shop .product-img img, ' +
            '#home_collection_shop .product-img img';

        document.querySelectorAll(selector).forEach(function (img) {
            if (img.complete && img.naturalWidth === 0) {
                img.src = 'https://placehold.co/400x300/f2dd9a/2b2118?text=Image+Unavailable';
            }
            img.addEventListener('error', function () {
                this.src = 'https://placehold.co/400x300/f2dd9a/2b2118?text=Image+Unavailable';
            }, { once: true });
        });
    })();

    /* ---------- Fixed header on scroll (jQuery) ---------- */
    if (window.jQuery) {
        (function ($) {
            $(window).on('scroll', function () {
                fixheader();
            });
            fixheader();
            function fixheader() {
                if (window.innerWidth >= 768) {
                    var scrollTop = $(window).scrollTop();
                    var header = $('#head_search_bar');
                    var headheight = header.outerHeight();
                    var menu_div = $('.top_header');
                    var menu_div_height = menu_div.outerHeight();
                    var to_menu_cntnr_hgt = headheight + menu_div_height;
                    if (scrollTop > 50) {
                        header.addClass('fixed').css({
                            position: 'fixed', top: '0px', left: '0px', right: '0px', zIndex: 1031,
                            marginLeft: '0px', marginRight: '0px'
                        });
                        menu_div.addClass('fixed').css({
                            position: 'fixed', top: headheight + 'px', left: '0px', right: '0px', zIndex: 1030,
                            marginLeft: '0px', marginRight: '0px'
                        });
                        $("#header_seprator").css('height', to_menu_cntnr_hgt + 'px');
                    } else {
                        header.removeClass('fixed').css({ position: '', top: '', left: '', right: '', zIndex: '', marginLeft: '', marginRight: '' });
                        menu_div.removeClass('fixed').css({ position: '', top: '', left: '', right: '', zIndex: '', marginLeft: '', marginRight: '' });
                        $("#header_seprator").css('height', 'inherit');
                    }
                } else {
                    $('#head_search_bar').removeClass('fixed').css({ position: '', top: '', left: '', right: '', zIndex: '', marginLeft: '', marginRight: '' });
                    $('.top_header').removeClass('fixed').css({ position: '', top: '', left: '', right: '', zIndex: '', marginLeft: '', marginRight: '' });
                    $("#header_seprator").css('height', '0px');
                }
            }

            function checkOrientation() {
                if (window.innerWidth <= 767) return;
                if (window.orientation === 0 || $(window).width() < $(window).height()) {
                    var header_block_height = $('div.top_header').outerHeight();
                    $('div#header_seprator').css('height', header_block_height + "px");
                } else {
                    $('div#header_seprator').css('height', '');
                }
            }
            $(window).on('resize orientationchange', checkOrientation);
            checkOrientation();
        })(window.jQuery);
    }

    /* ---------- Desktop "Categories" mega-menu hover ---------- */
    (function () {
        var trigger = document.querySelector('.top_header .col-lg-3');
        var panel = document.getElementById('navbar-vertical');
        if (!trigger || !panel) return;
        var hideTimeout;

        panel.classList.remove('collapse');

        function open() {
            clearTimeout(hideTimeout);
            var headerRow = document.querySelector('.top_header');
            if (headerRow) {
                panel.style.top = headerRow.getBoundingClientRect().bottom + 'px';
            }
            panel.classList.add('mg-mega-open');
        }
        window.addEventListener('scroll', function () {
            if (panel.classList.contains('mg-mega-open')) {
                var headerRow = document.querySelector('.top_header');
                if (headerRow) panel.style.top = headerRow.getBoundingClientRect().bottom + 'px';
            }
        });
        function scheduleClose() {
            hideTimeout = setTimeout(function () {
                panel.classList.remove('mg-mega-open');
            }, 200);
        }

        trigger.addEventListener('mouseenter', open);
        trigger.addEventListener('mouseleave', scheduleClose);
        panel.addEventListener('mouseenter', open);
        panel.addEventListener('mouseleave', scheduleClose);
    })();

    /* ---------- "Collection" sub-dropdown hover ---------- */
    (function () {
        var wrapperItem = document.querySelector('.category_dropdown .nav-item.dropdown');
        var trigger = document.querySelector('.category_dropdown .nav-item.dropdown > a.nav-link');
        var collectionMenu = document.querySelector('.category_dropdown .dropdown-menu');
        var megaMenu = document.getElementById('navbar-vertical');
        if (!wrapperItem || !trigger || !collectionMenu || !megaMenu) return;

        trigger.removeAttribute('data-toggle');
        trigger.addEventListener('click', function (e) { e.preventDefault(); });

        var closeTimer;
        function openCollection() {
            clearTimeout(closeTimer);
            megaMenu.classList.add('mg-collection-active');
            collectionMenu.classList.add('mg-collection-show');
        }
        function scheduleClose() {
            closeTimer = setTimeout(function () {
                megaMenu.classList.remove('mg-collection-active');
                collectionMenu.classList.remove('mg-collection-show');
            }, 200);
        }

        wrapperItem.addEventListener('mouseenter', openCollection);
        wrapperItem.addEventListener('mouseleave', scheduleClose);
        collectionMenu.addEventListener('mouseenter', openCollection);
        collectionMenu.addEventListener('mouseleave', scheduleClose);
    })();

    /* ---------- Desktop search suggestions ---------- */
    (function () {
        var wrap = document.getElementById('mg_search_wrap');
        var input = document.getElementById('mg_search_input');
        var panel = document.getElementById('mg_search_suggestions');
        var overlay = document.getElementById('mg_search_overlay');
        var chipsBox = panel ? panel.querySelector('.mg-suggest-chips') : null;
        if (!wrap || !input || !panel || !overlay || !chipsBox) return;

        var defaultChipsHTML = chipsBox.innerHTML;

        var sourceLinks = document.querySelectorAll('.category_dropdown a.nav-link, .category_dropdown a.dropdown-item');
        var catalog = [];
        var seen = {};
        sourceLinks.forEach(function (a) {
            var name = a.textContent.trim();
            var href = a.getAttribute('href');
            if (name && href && !seen[name]) {
                seen[name] = true;
                catalog.push({ name: name, href: href });
            }
        });

        function renderMatches(query) {
            var q = query.trim().toLowerCase();
            if (!q) {
                chipsBox.innerHTML = defaultChipsHTML;
                return;
            }
            var matches = catalog.filter(function (item) {
                return item.name.toLowerCase().indexOf(q) !== -1;
            }).slice(0, 10);

            if (matches.length === 0) {
                chipsBox.innerHTML = '<span class="mg-suggest-none">No matching products found</span>';
                return;
            }

            chipsBox.innerHTML = matches.map(function (item) {
                return '<a href="' + item.href + '">' + item.name + '</a>';
            }).join('');
        }

        function openSearch() {
            panel.classList.add('mg-search-open');
            overlay.classList.add('mg-search-open');
        }
        function closeSearch() {
            panel.classList.remove('mg-search-open');
            overlay.classList.remove('mg-search-open');
        }

        input.addEventListener('focus', openSearch);
        input.addEventListener('click', openSearch);
        input.addEventListener('input', function () { renderMatches(input.value); });
        overlay.addEventListener('click', closeSearch);

        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) {
                closeSearch();
            }
        });
    })();

    /* ---------- Mobile search suggestions ---------- */
    (function () {
        var input = document.getElementById('mob_search_input');
        var panel = document.getElementById('mob_search_suggestions');
        var overlay = document.getElementById('mob_search_overlay');
        var defaultSection = document.getElementById('mob_suggest_default');
        var resultsSection = document.getElementById('mob_suggest_results');
        var resultsList = document.getElementById('mob_suggest_results_list');
        if (!input || !panel || !overlay) return;

        var sourceLinks = document.querySelectorAll('#mobileCategories a, .category_dropdown a.nav-link, .category_dropdown a.dropdown-item');
        var catalog = [];
        var seen = {};
        sourceLinks.forEach(function (a) {
            var name = a.textContent.trim();
            var href = a.getAttribute('href');
            if (name && href && !seen[name]) {
                seen[name] = true;
                catalog.push({ name: name, href: href });
            }
        });

        var searchBarWrap = document.getElementById('mob_search_bar');

        function openPanel() {
            if (searchBarWrap) searchBarWrap.classList.add('mg-suggest-active');
            panel.classList.add('mg-search-open');
            overlay.classList.add('mg-search-open');
        }
        function closePanel() {
            if (searchBarWrap) searchBarWrap.classList.remove('mg-suggest-active');
            panel.classList.remove('mg-search-open');
            overlay.classList.remove('mg-search-open');
        }

        function renderResults(query) {
            var q = query.trim().toLowerCase();
            if (!q) {
                if (defaultSection) defaultSection.style.display = '';
                if (resultsSection) resultsSection.style.display = 'none';
                return;
            }
            var matches = catalog.filter(function (item) {
                return item.name.toLowerCase().indexOf(q) !== -1;
            }).slice(0, 8);

            if (defaultSection) defaultSection.style.display = 'none';
            if (resultsSection) resultsSection.style.display = '';
            if (!resultsList) return;
            resultsList.innerHTML = '';

            if (matches.length === 0) {
                var none = document.createElement('span');
                none.className = 'mg-suggest-none';
                none.textContent = 'No matching products found';
                resultsList.appendChild(none);
                return;
            }

            matches.forEach(function (item) {
                var a = document.createElement('a');
                a.href = item.href;
                a.innerHTML = '<i class="fa fa-gem"></i> ' + item.name;
                resultsList.appendChild(a);
            });
        }

        input.addEventListener('focus', openPanel);
        input.addEventListener('click', openPanel);
        input.addEventListener('input', function () { renderResults(input.value); });
        overlay.addEventListener('click', closePanel);

        document.addEventListener('click', function (e) {
            if (!panel.contains(e.target) && e.target !== input && !overlay.contains(e.target)) {
                closePanel();
            }
        });
    })();

    /* ---------- Rate widget toggle (open/close panel) ---------- */
    (function () {
        var btn = document.getElementById('mg_rate_toggle_btn');
        var panel = document.getElementById('mg_rate_panel');
        if (!btn || !panel) return;

        btn.addEventListener('click', function () {
            var isOpen = panel.classList.toggle('mg-rate-open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    })();

    /* ---------- Live gold/silver rate fetch (fills header ticker + rate widget) ---------- */
    if (window.jQuery) {
        (function ($) {
            $.get('https://justudhari.com#', "", function (response) {
                if (response && response.rates_arr) {
                    var rates = response.rates_arr;
                    if (rates.gold) {
                        $.each(rates.gold, function (i, v) {
                            $('#rate_gold_' + i).text((v) ? (Math.round(v * 10)).toLocaleString("en-IN") : '-');
                        });
                    }
                    if (rates.silver) {
                        $.each(rates.silver, function (i, v) {
                            $('#rate_silver_' + i).text((v) ? (Math.round(v)).toLocaleString("en-IN") : '-');
                        });
                    }
                    if (rates.date) {
                        $('#rate_update').text(rates.date);
                    }
                }
            });
        })(window.jQuery);
    }

    /* ---------- Videos: play button toggle (index page only) ---------- */
    (function () {
        document.querySelectorAll('#home_videos_shop .mg-video-card').forEach(function (card) {
            var video = card.querySelector('.mg-video-el');
            var btn = card.querySelector('.mg-video-play');
            if (!video || !btn) return;

            btn.addEventListener('click', function () {
                if (video.paused) {
                    video.play();
                    card.classList.add('mg-video-playing');
                } else {
                    video.pause();
                    card.classList.remove('mg-video-playing');
                }
            });
        });
    })();

    /* ---------- Videos: mobile swipe slider (index page only) ---------- */
    (function () {
        var track = document.getElementById('mg_video_track');
        if (!track) return;

        function pauseAllVideos() {
            track.querySelectorAll('video').forEach(function (v) {
                v.pause();
                var card = v.closest('.mg-video-card');
                if (card) card.classList.remove('mg-video-playing');
            });
        }

        function itemOffset() {
            var first = track.firstElementChild;
            return first.getBoundingClientRect().width;
        }

        function slide(direction) {
            if (window.innerWidth > 767) return;
            if (track.dataset.sliding === '1') return;
            track.dataset.sliding = '1';

            pauseAllVideos();
            var offset = itemOffset();
            var distance = (direction === 'next') ? -offset : offset;

            track.style.transition = 'transform 0.5s cubic-bezier(.22,.9,.32,1)';
            track.style.transform = 'translateX(' + distance + 'px)';

            track.addEventListener('transitionend', function handler() {
                track.removeEventListener('transitionend', handler);
                if (direction === 'next') {
                    track.appendChild(track.firstElementChild);
                } else {
                    track.insertBefore(track.lastElementChild, track.firstElementChild);
                }
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                void track.offsetWidth;
                track.dataset.sliding = '0';
            }, { once: true });
        }

        var rightBtn = document.getElementById('video-slide-right');
        var leftBtn = document.getElementById('video-slide-left');
        if (rightBtn) rightBtn.addEventListener('click', function () { slide('next'); });
        if (leftBtn) leftBtn.addEventListener('click', function () { slide('prev'); });
        window.mgVideoSlideNext = function () { slide('next'); };

        var touchStartX = 0, touchEndX = 0;
        track.addEventListener('touchstart', function (e) {
            if (window.innerWidth > 767) return;
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        track.addEventListener('touchend', function (e) {
            if (window.innerWidth > 767) return;
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) slide('next');
                else slide('prev');
            }
        }, { passive: true });
    })();

    /* ---------- Videos: auto-advance when a video ends (index page only) ---------- */
    (function () {
        var track = document.getElementById('mg_video_track');
        if (!track) return;

        function rotateDesktop() {
            track.appendChild(track.firstElementChild);
        }

        function onVideoEnded(e) {
            var video = e.target;
            var card = video.closest('.mg-video-card');
            if (card) card.classList.remove('mg-video-playing');

            if (window.innerWidth > 767) {
                rotateDesktop();
            } else if (typeof window.mgVideoSlideNext === 'function') {
                window.mgVideoSlideNext();
            }

            setTimeout(function () {
                var current = window.innerWidth > 767
                    ? track.children[1]
                    : track.children[0];
                var v = current ? current.querySelector('video') : null;
                if (v) {
                    v.play();
                    var c = v.closest('.mg-video-card');
                    if (c) c.classList.add('mg-video-playing');
                }
            }, 550);
        }

        track.querySelectorAll('video').forEach(function (v) {
            v.addEventListener('ended', onVideoEnded);
        });
    })();

    /* ---------- Videos: autoplay current video on scroll into view, click a side card to bring to center (index page only) ---------- */
    (function () {
        var track = document.getElementById('mg_video_track');
        var section = document.getElementById('home_videos_shop');
        if (!track || !section) return;

        function pauseAll() {
            track.querySelectorAll('video').forEach(function (v) {
                v.pause();
                var c = v.closest('.mg-video-card');
                if (c) c.classList.remove('mg-video-playing');
            });
        }

        function playCurrent() {
            var current = window.innerWidth > 767 ? track.children[1] : track.children[0];
            if (!current) return;
            var v = current.querySelector('video');
            var c = current.querySelector('.mg-video-card');
            if (v) {
                v.play().catch(function () { /* ignore autoplay rejection */ });
                if (c) c.classList.add('mg-video-playing');
            }
        }

        if ('IntersectionObserver' in window) {
            var played = false;
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !played) {
                        played = true;
                        playCurrent();
                        io.unobserve(section);
                    }
                });
            }, { threshold: 0.4 });
            io.observe(section);
        }

        track.addEventListener('click', function (e) {
            if (window.innerWidth <= 767) return;

            var card = e.target.closest('.mg-video-card');
            if (!card) return;
            var col = card.closest('.col-lg-4');
            var children = Array.prototype.slice.call(track.children);
            var idx = children.indexOf(col);

            if (idx === 1 || idx === -1) return;

            e.preventDefault();
            e.stopPropagation();

            pauseAll();
            if (idx === 0) {
                track.insertBefore(track.lastElementChild, track.firstElementChild);
            } else {
                track.appendChild(track.firstElementChild);
            }
            playCurrent();
        }, true);
    })();

    /* ---------- Mobile search bar show/hide toggle ---------- */
    (function () {
        var openBtn = document.getElementById('mob_search_toggle');
        var closeBtn = document.getElementById('mob_search_close');
        var headerIcon = document.getElementById('mob_search_btn');
        var bar = document.getElementById('mob_search_bar');
        if (!openBtn || !closeBtn || !headerIcon || !bar) return;

        openBtn.addEventListener('click', function (e) {
            e.preventDefault();
            bar.classList.remove('mob_disappear');
            bar.classList.add('mob_appear');
            headerIcon.style.display = 'none';
        });

        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            bar.classList.remove('mob_appear');
            bar.classList.add('mob_disappear');
            headerIcon.style.display = '';
        });
    })();

    /* ---------- WhatsApp help-widget link (present on every page via footer.html) ---------- */
    (function () {
        var whatsappLink = document.getElementById("whatsapp_out");
        if (!whatsappLink) return;
        var phone = "+91-7974488285".replace(/\D/g, '');
        var message = encodeURIComponent("Hello, I want more details about your services.");
        var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            whatsappLink.href = "https://wa.me/" + phone + "?text=" + message;
        } else {
            whatsappLink.href = "https://web.whatsapp.com/send?phone=" + phone + "&text=" + message;
        }
    })();

    /* ---------- Popup modal (msgpopupmodal — present on every page via footer.html) ---------- */
    (function () {
        var modal = document.getElementById("msgpopupmodal");
        var messageElement = document.getElementById("msgpopupmodalmessage");
        var span = document.getElementById("msgpopupmodalclose");
        if (!modal || !messageElement || !span) return;

        window.showpopupmessage = function (message) {
            messageElement.textContent = message;
            modal.style.display = "block";
        };

        span.onclick = function () {
            modal.style.display = "none";
        };

        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    })();

    /* ---------- Hamburger / mobile full-screen menu ---------- */
    (function () {
        var hamburger = document.getElementById('hamburger');
        var menu = document.getElementById('mobileMenu');
        var backdrop = document.getElementById('menuBackdrop');
        var closeBtn = document.getElementById('menuClose');
        if (!hamburger || !menu || !backdrop || !closeBtn) return;

        function openMenu() {
            menu.classList.add('open');
            backdrop.classList.add('visible');
            menu.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            backdrop.setAttribute('aria-hidden', 'false');
            closeBtn.focus();
            document.documentElement.style.overflow = 'hidden';
            setTimeout(function () { void menu.offsetWidth; }, 20);
        }

        function closeMenu() {
            menu.classList.remove('open');
            backdrop.classList.remove('visible');
            menu.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            backdrop.setAttribute('aria-hidden', 'true');
            hamburger.focus();
            document.documentElement.style.overflow = '';
        }

        hamburger.addEventListener('click', function () {
            if (menu.classList.contains('open')) closeMenu();
            else openMenu();
        });

        closeBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });

        menu.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' && !e.target.closest('#mobileCategories')) {
                closeMenu();
            }
        });

        (function addSwipeClose() {
            var startX = null;
            var startY = null;
            menu.addEventListener('touchstart', function (e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            menu.addEventListener('touchmove', function (e) {
                if (startX === null || startY === null) return;
                var currentX = e.touches[0].clientX;
                var currentY = e.touches[0].clientY;
                var dx = currentX - startX;
                var dy = Math.abs(currentY - startY);
                if (dx > 40 && dx > dy * 1.5) {
                    closeMenu();
                    startX = null;
                    startY = null;
                }
            });
            menu.addEventListener('touchend', function () {
                startX = null;
                startY = null;
            });
        })();
    })();

    /* ---------- Mobile "Categories" collapse toggle ---------- */
    (function () {
        var catLink = document.querySelector(".mob_cat");
        if (!catLink) return;
        catLink.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var targetId = catLink.getAttribute("data-target");
            var target = document.querySelector(targetId);
            if (!target) return;
            if (target.classList.contains("show")) {
                target.classList.remove("show");
            } else {
                target.classList.add("show");
            }
        });
    })();

    /* ---------- Top search field focus/blur (jQuery) ---------- */
    if (window.jQuery) {
        (function ($) {
            $('#top-search-field > input[name="search_term"]').focus(function () {
                $(this).parent("div#top-search-field").removeClass('minimul').addClass('normal');
            });
            $('#top-search-field > input[name="search_term"]').on('blur', function () {
                $(this).parent("div#top-search-field").removeClass('normal').addClass('minimul');
            });
        })(window.jQuery);
    }

})();


