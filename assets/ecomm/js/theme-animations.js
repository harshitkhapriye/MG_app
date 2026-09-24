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
                    '#home_category_shop .row.content > div:nth-child(4) .product-item'
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

    /* ---------- Shop-by-Material card rotation (index page only, desktop only) ---------- */
    (function () {
        if (window.innerWidth <= 991.98) return; // Keep static on mobile as requested (Tanishq style)
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

        var slides = Array.from(track.querySelectorAll('.catalog.slide'));
        if (slides.length === 0) return;

        var isMobile = function () { return window.innerWidth <= 991.98; };

        // =========================================================================
        // MOBILE SMOOTH TRANSITION CONTROLLER
        // The white card stays static, while catalogue images smoothly cross-fade.
        // =========================================================================
        var activeIndex = 0;
        var mobileTimer = null;

        function updateMobileSlides(newIndex) {
            slides.forEach(function (slide, idx) {
                if (idx === newIndex) {
                    slide.classList.add('mg-slide-active');
                } else {
                    slide.classList.remove('mg-slide-active');
                }
            });
            activeIndex = newIndex;
        }

        function nextMobileSlide() {
            var nextIndex = (activeIndex + 1) % slides.length;
            updateMobileSlides(nextIndex);
        }

        function prevMobileSlide() {
            var prevIndex = (activeIndex - 1 + slides.length) % slides.length;
            updateMobileSlides(prevIndex);
        }

        function startMobileLoop() {
            if (mobileTimer) clearInterval(mobileTimer);
            if (isMobile()) {
                updateMobileSlides(activeIndex);
                mobileTimer = setInterval(nextMobileSlide, 3500);
            }
        }

        startMobileLoop();

        window.addEventListener('resize', function () {
            if (isMobile()) {
                if (!mobileTimer) startMobileLoop();
            } else {
                if (mobileTimer) {
                    clearInterval(mobileTimer);
                    mobileTimer = null;
                }
                slides.forEach(function (slide) {
                    slide.classList.remove('mg-slide-active');
                });
            }
        });

        // =========================================================================
        // DESKTOP HORIZONTAL SLIDER CONTROLLER
        // =========================================================================
        function itemOffset() {
            var first = track.firstElementChild;
            var style = getComputedStyle(track);
            var gap = parseFloat(style.columnGap || style.gap || 0) || 0;
            return (first ? first.offsetWidth : 0) + gap;
        }

        function slide(direction) {
            if (isMobile()) {
                if (direction === 'next') nextMobileSlide();
                else prevMobileSlide();
                return;
            }

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

        // Touch swipe support (works smoothly on both mobile & tablet)
        var touchStartX = 0;
        var touchEndX = 0;

        track.addEventListener('touchstart', function (e) {
            if (!isMobile()) return;
            touchStartX = e.changedTouches[0].screenX;
            if (mobileTimer) clearInterval(mobileTimer);
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            if (!isMobile()) return;
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) nextMobileSlide();
                else prevMobileSlide();
            }
            startMobileLoop();
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

    /* ---------- Back to top button (present on every page via footer.html & inline) ---------- */
    function initBackToTop() {
        var btns = document.querySelectorAll('.back-to-top');
        if (!btns || btns.length === 0) return;

        function checkBackToTopScroll() {
            var scrolled = window.pageYOffset || document.documentElement.scrollTop;
            btns.forEach(function (btn) {
                if (document.body.classList.contains('mg-drawer-open')) {
                    btn.style.display = 'none';
                    return;
                }
                if (scrolled > 120) {
                    btn.style.display = 'block';
                    btn.style.opacity = '1';
                    btn.style.visibility = 'visible';
                } else {
                    btn.style.display = 'none';
                    btn.style.opacity = '0';
                    btn.style.visibility = 'hidden';
                }
            });
        }

        window.addEventListener('scroll', checkBackToTopScroll, { passive: true });
        checkBackToTopScroll();

        btns.forEach(function (btn) {
            if (!btn.dataset.bound) {
                btn.dataset.bound = '1';
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        });
    }
    initBackToTop();
    document.addEventListener('headerFooterReady', initBackToTop);

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

    /* ---------- Mobile header height measurement ---------- */
    function updateMobileHeaderHeight() {
        if (window.innerWidth < 992) {
            var mobHeader = document.getElementById('top_menu_bar_container');
            if (mobHeader) {
                var h = mobHeader.offsetHeight;
                if (h > 0) {
                    document.documentElement.style.setProperty('--mg-mobile-header-height', h + 'px');
                }
            }
        }
    }
    window.addEventListener('resize', updateMobileHeaderHeight);
    window.addEventListener('orientationchange', updateMobileHeaderHeight);
    document.addEventListener('headerFooterReady', function () {
        updateMobileHeaderHeight();
        setTimeout(updateMobileHeaderHeight, 100);
        setTimeout(updateMobileHeaderHeight, 300);
    });
    updateMobileHeaderHeight();

    /* ---------- Fixed header on scroll (jQuery) ---------- */
    if (window.jQuery) {
        (function ($) {
            $(window).on('scroll', function () {
                fixheader();
            });
            fixheader();
            function fixheader() {
                if (window.innerWidth >= 992) {
                    var scrollTop = $(window).scrollTop();
                    var header = $('#head_search_bar');
                    var headheight = header.outerHeight() || 0;
                    var menu_div = $('.top_header');
                    var menu_div_height = menu_div.outerHeight() || 0;
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
                    // Mobile view: header is fixed via CSS at the top.
                    // Clean up desktop inline overrides on #head_search_bar and #header_seprator
                    $('#head_search_bar').removeClass('fixed').css({ position: '', top: '', left: '', right: '', zIndex: '', marginLeft: '', marginRight: '' });
                    $('.top_header').removeClass('fixed').css({ top: '', left: '', right: '', zIndex: '', marginLeft: '', marginRight: '' });
                    $("#header_seprator").css('height', '0px');
                }
            }

            $(window).on('resize orientationchange', updateMobileHeaderHeight);
            updateMobileHeaderHeight();
            setTimeout(updateMobileHeaderHeight, 100);
            setTimeout(updateMobileHeaderHeight, 500);

            function checkOrientation() {
                if (window.innerWidth < 992) {
                    $('div#header_seprator').css('height', '0px');
                    return;
                }
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
    function initMobileSearchSuggestions() {
        var input = document.getElementById('mob_search_input');
        var panel = document.getElementById('mob_search_suggestions');
        var overlay = document.getElementById('mob_search_overlay');
        var defaultSection = document.getElementById('mob_suggest_default');
        var resultsSection = document.getElementById('mob_suggest_results');
        var resultsList = document.getElementById('mob_suggest_results_list');
        if (!input || !panel || !overlay) return;
        if (input.dataset.bound) return;
        input.dataset.bound = '1';

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
    }
    initMobileSearchSuggestions();
    document.addEventListener('headerFooterReady', initMobileSearchSuggestions);

    /* ---------- Rate widget toggle (open/close floating panel on desktop & mobile) ---------- */
    function initRateWidget() {
        var btn = document.getElementById('mg_rate_toggle_btn');
        var panel = document.getElementById('mg_rate_panel');
        if (!btn || !panel) return;
        if (btn.dataset.bound) return;
        btn.dataset.bound = '1';

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = panel.classList.toggle('mg-rate-open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            // If opening on mobile, close search bar if currently open
            if (isOpen && window.innerWidth < 992) {
                var searchBar = document.getElementById('mob_search_bar');
                var searchIcon = document.getElementById('mob_search_toggle_icon');
                var searchBtn = document.getElementById('mob_search_toggle_btn');
                var searchOverlay = document.getElementById('mob_search_overlay');
                var searchSuggestions = document.getElementById('mob_search_suggestions');
                var searchInput = document.getElementById('mob_search_input');
                if (searchBar && searchBar.classList.contains('mg-search-expanded')) {
                    searchBar.classList.remove('mg-search-expanded');
                    if (searchIcon) {
                        searchIcon.classList.remove('fa-times');
                        searchIcon.classList.add('fa-search');
                    }
                    if (searchBtn) searchBtn.setAttribute('aria-expanded', 'false');
                    if (searchOverlay) searchOverlay.classList.remove('mg-search-open');
                    if (searchSuggestions) searchSuggestions.classList.remove('mg-search-open');
                    if (searchBar) searchBar.classList.remove('mg-suggest-active');
                    if (searchInput) searchInput.blur();
                    updateMobileHeaderHeight();
                }
            }
        });

        document.addEventListener('click', function (e) {
            if (panel.classList.contains('mg-rate-open') && !panel.contains(e.target) && !btn.contains(e.target)) {
                panel.classList.remove('mg-rate-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    initRateWidget();
    document.addEventListener('headerFooterReady', initRateWidget);

    // =========================================================================
    // FRONTEND UI MODULE: Mobile Floating "Today's Rate" Ticker-Triggered Reveal
    // Trigger Specification:
    // - Ticker row visible on screen: floating badge is HIDDEN (smooth fade & slide-out).
    // - Ticker row hidden / scrolled out of view: floating badge APPEARS (smooth fade & slide-in).
    // - Ticker row visible again on scroll up: floating badge DISAPPEARS (smooth reverse animation).
    // Scoped strictly to mobile viewports (< 992px); desktop widget remains always visible.
    // =========================================================================
    function initMobileRateScrollReveal() {
        var rateWidget = document.getElementById('rate_ticker_toggle_area');
        if (!rateWidget) return;
        if (rateWidget.dataset.scrollBound) return;
        rateWidget.dataset.scrollBound = '1';

        var scrollTicking = false;

        function updateRateScrollVisibility() {
            // Desktop safety: never hide or interfere on desktop viewports
            if (window.innerWidth >= 992) {
                rateWidget.classList.remove('mg-rate-visible');
                scrollTicking = false;
                return;
            }

            var tickerArea = document.getElementById('rate_ticker_area');
            var mobHeader = document.getElementById('top_menu_bar_container');

            // Fallback: If ticker element does not exist on this page, show floating badge
            if (!tickerArea || tickerArea.offsetHeight === 0) {
                if (!rateWidget.classList.contains('mg-rate-visible')) {
                    rateWidget.classList.add('mg-rate-visible');
                }
                scrollTicking = false;
                return;
            }

            // Mobile fixed header bottom edge (or fallback height)
            var headerBottom = mobHeader ? mobHeader.getBoundingClientRect().bottom : (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mg-mobile-header-height')) || 56);
            var tickerRect = tickerArea.getBoundingClientRect();

            // The ticker row is visible if its bottom edge extends below the fixed header
            // and its top edge is still within the visible viewport
            var isTickerVisible = (tickerRect.bottom > headerBottom + 2) && (tickerRect.top < (window.innerHeight || document.documentElement.clientHeight));

            if (!isTickerVisible) {
                // Ticker row has scrolled away / hidden -> REVEAL floating badge with smooth animation
                if (!rateWidget.classList.contains('mg-rate-visible')) {
                    rateWidget.classList.add('mg-rate-visible');
                }
            } else {
                // Ticker row is visible on screen -> HIDE floating badge with smooth reverse animation
                if (rateWidget.classList.contains('mg-rate-visible')) {
                    rateWidget.classList.remove('mg-rate-visible');
                    // Clean UX: if user scrolls back up to the visible ticker row, close the rate dropdown panel if open
                    var panel = document.getElementById('mg_rate_panel');
                    var btn = document.getElementById('mg_rate_toggle_btn');
                    if (panel && panel.classList.contains('mg-rate-open')) {
                        panel.classList.remove('mg-rate-open');
                        if (btn) btn.setAttribute('aria-expanded', 'false');
                    }
                }
            }
            scrollTicking = false;
        }

        function onScrollThrottled() {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateRateScrollVisibility);
                scrollTicking = true;
            }
        }

        window.addEventListener('scroll', onScrollThrottled, { passive: true });
        window.addEventListener('resize', onScrollThrottled, { passive: true });
        window.addEventListener('orientationchange', onScrollThrottled, { passive: true });

        // Initial evaluation on mount
        updateRateScrollVisibility();
    }
    initMobileRateScrollReveal();
    document.addEventListener('headerFooterReady', initMobileRateScrollReveal);

    /* ---------- Live gold/silver rate fetch (fills header ticker + floating rate widget) ---------- */
    var latestRatesData = null;
    function applyRatesToDOM(rates) {
        if (!rates || !window.jQuery) return;
        var $ = window.jQuery;
        if (rates.gold) {
            $.each(rates.gold, function (i, v) {
                var formatted = (v) ? (Math.round(v * 10)).toLocaleString("en-IN") : '-';
                $('#rate_gold_' + i + ', #rate_gold_' + i + '_panel').text(formatted);
            });
        }
        if (rates.silver) {
            $.each(rates.silver, function (i, v) {
                var formatted = (v) ? (Math.round(v)).toLocaleString("en-IN") : '-';
                $('#rate_silver_' + i + ', #rate_silver_' + i + '_panel').text(formatted);
            });
        }
        if (rates.date) {
            $('#rate_update, #rate_update_panel').text(rates.date);
        }
    }

    if (window.jQuery) {
        (function ($) {
            $.get('https://justudhari.com#', "", function (response) {
                if (response && response.rates_arr) {
                    latestRatesData = response.rates_arr;
                    applyRatesToDOM(latestRatesData);
                }
            });
        })(window.jQuery);
    }
    document.addEventListener('headerFooterReady', function () {
        if (latestRatesData) {
            applyRatesToDOM(latestRatesData);
        }
    });

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

    /* ---------- Mobile Header Search Toggle (UI Module) ---------- */
    // Senior Developer Note: Modular UI toggle for mobile search bar (#mob_search_bar).
    // Dynamic search term submission hooks into cateloge.html?search_term=...
    var _lastSearchToggle = 0;
    window.toggleMobileSearch = function (e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
            e.stopPropagation();
        }
        var now = Date.now();
        if (now - _lastSearchToggle < 280) {
            return; // Debounce guard: prevents rapid double-fire from touch/click collisions
        }
        _lastSearchToggle = now;

        var searchBar = document.getElementById('mob_search_bar');
        var searchToggleIcon = document.getElementById('mob_search_toggle_icon');
        var searchToggleBtn = document.getElementById('mob_search_toggle_btn');
        var searchInput = document.getElementById('mob_search_input');
        var searchOverlay = document.getElementById('mob_search_overlay');
        var searchSuggestions = document.getElementById('mob_search_suggestions');
        var ratePanel = document.getElementById('mg_rate_panel');
        var rateBtn = document.getElementById('mg_rate_toggle_btn');

        if (!searchBar) return;

        var isExpanded = searchBar.classList.contains('mg-search-expanded') || searchBar.classList.contains('mob_appear');

        if (isExpanded) {
            // Close search bar
            searchBar.classList.remove('mg-search-expanded', 'mob_appear');
            searchBar.classList.add('mob_disappear');
            if (searchToggleBtn) {
                searchToggleBtn.setAttribute('aria-expanded', 'false');
                searchToggleBtn.setAttribute('data-search-state', 'closed');
                searchToggleBtn.classList.remove('mg-search-active');
            }
            if (searchToggleIcon) {
                searchToggleIcon.classList.remove('fa-times');
                searchToggleIcon.classList.add('fa-search');
            }
            if (searchOverlay) searchOverlay.classList.remove('mg-search-open');
            if (searchSuggestions) searchSuggestions.classList.remove('mg-search-open');
            searchBar.classList.remove('mg-suggest-active');
            if (searchInput) searchInput.blur();
        } else {
            // Open search bar
            // If floating rate panel is open, close it to avoid visual overlap
            if (ratePanel && ratePanel.classList.contains('mg-rate-open')) {
                ratePanel.classList.remove('mg-rate-open');
            }
            if (rateBtn) rateBtn.setAttribute('aria-expanded', 'false');

            searchBar.classList.remove('mob_disappear');
            searchBar.classList.add('mg-search-expanded', 'mob_appear');
            if (searchToggleBtn) {
                searchToggleBtn.setAttribute('aria-expanded', 'true');
                searchToggleBtn.setAttribute('data-search-state', 'open');
                searchToggleBtn.classList.add('mg-search-active');
            }
            if (searchToggleIcon) {
                searchToggleIcon.classList.remove('fa-search');
                searchToggleIcon.classList.add('fa-times');
            }
            if (searchInput) {
                setTimeout(function () {
                    searchInput.focus();
                }, 100);
            }
        }

        if (typeof updateMobileHeaderHeight === 'function') {
            updateMobileHeaderHeight();
        }
    };

    function initMobileHeaderActions() {
        var searchToggleBtn = document.getElementById('mob_search_toggle_btn');
        if (searchToggleBtn && !searchToggleBtn.dataset.bound) {
            searchToggleBtn.dataset.bound = '1';
            // Event listener registered; debounce in toggleMobileSearch prevents double-invocations
            searchToggleBtn.addEventListener('click', window.toggleMobileSearch);
        }
    }
    initMobileHeaderActions();
    document.addEventListener('headerFooterReady', initMobileHeaderActions);

    // Event delegation on document as foolproof touch/tap fallback
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('#mob_search_toggle_btn');
        if (btn && !btn.dataset.bound) {
            window.toggleMobileSearch(e);
        }
    });

    /* ---------- WhatsApp help-widget & popup modal (present on every page via footer.html) ---------- */
    function initFooterWidgets() {
        var whatsappLink = document.getElementById("whatsapp_out");
        if (whatsappLink && !whatsappLink.dataset.bound) {
            whatsappLink.dataset.bound = '1';
            var phone = "+91-7974488285".replace(/\D/g, '');
            var message = encodeURIComponent("Hello, I want more details about your services.");
            var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isMobile) {
                whatsappLink.href = "https://wa.me/" + phone + "?text=" + message;
            } else {
                whatsappLink.href = "https://web.whatsapp.com/send?phone=" + phone + "&text=" + message;
            }
        }

        var modal = document.getElementById("msgpopupmodal");
        var messageElement = document.getElementById("msgpopupmodalmessage");
        var span = document.getElementById("msgpopupmodalclose");
        if (modal && messageElement && span && !modal.dataset.bound) {
            modal.dataset.bound = '1';
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
        }
    }
    initFooterWidgets();
    document.addEventListener('headerFooterReady', initFooterWidgets);

    /* =========================================================================
       BACKEND INTEGRATION POINT: LiveChat State & Modal Management (Tanishq Style)
       Endpoints:
       - Pre-Chat Lead POST: /api/v1/chat/start
       ========================================================================= */
    function openLiveChat() {
        var liveChatModal = document.getElementById('mg_livechat_modal');
        if (!liveChatModal) return;
        liveChatModal.classList.add('open');
        liveChatModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mg-livechat-open');
        var firstInput = document.getElementById('mg_chat_input_name');
        if (firstInput) {
            setTimeout(function () { firstInput.focus(); }, 120);
        }
    }

    function closeLiveChat() {
        var liveChatModal = document.getElementById('mg_livechat_modal');
        if (!liveChatModal) return;
        liveChatModal.classList.remove('open');
        liveChatModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mg-livechat-open');
    }

    // Expose globally for programmatic access or external triggers
    window.openLiveChat = openLiveChat;
    window.closeLiveChat = closeLiveChat;

    function initLiveChat() {
        var dockedTab = document.getElementById('mg_docked_chat_tab');
        var liveChatModal = document.getElementById('mg_livechat_modal');
        var minBtn = document.getElementById('mg_livechat_minimize_btn');
        var closeChatBtn = document.getElementById('mg_livechat_close_btn');
        var chatForm = document.getElementById('mg_livechat_form');

        // Bind Docked tab click -> Opens LiveChat modal
        if (dockedTab && !dockedTab.dataset.bound) {
            dockedTab.dataset.bound = '1';
            dockedTab.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openLiveChat();
            });
        }

        // Bind modal minimize & close buttons
        if (minBtn && !minBtn.dataset.bound) {
            minBtn.dataset.bound = '1';
            minBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeLiveChat();
            });
        }

        if (closeChatBtn && !closeChatBtn.dataset.bound) {
            closeChatBtn.dataset.bound = '1';
            closeChatBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeLiveChat();
            });
        }

        // Modal backdrop click
        if (liveChatModal && !liveChatModal.dataset.bound) {
            liveChatModal.dataset.bound = '1';
            liveChatModal.addEventListener('click', function (e) {
                if (e.target === liveChatModal) {
                    closeLiveChat();
                }
            });
        }

        // Bind Form Submission
        if (chatForm && !chatForm.dataset.bound) {
            chatForm.dataset.bound = '1';
            chatForm.addEventListener('submit', function (e) {
                e.preventDefault();
                var nameInput = document.getElementById('mg_chat_input_name');
                var mobileInput = document.getElementById('mg_chat_input_mobile');
                var emailInput = document.getElementById('mg_chat_input_email');
                var feedback = document.getElementById('mg_chat_form_feedback');
                var submitBtn = document.getElementById('mg_chat_start_btn');

                var name = nameInput ? nameInput.value.trim() : '';
                var mobile = mobileInput ? mobileInput.value.trim() : '';
                var email = emailInput ? emailInput.value.trim() : '';

                if (!name || !mobile || !email) {
                    if (feedback) {
                        feedback.className = 'mg-livechat-feedback error';
                        feedback.textContent = 'Please fill in all required fields.';
                        feedback.style.display = 'block';
                    }
                    return;
                }

                var cleanPhone = mobile.replace(/[^0-9]/g, '');
                if (cleanPhone.length < 10) {
                    if (feedback) {
                        feedback.className = 'mg-livechat-feedback error';
                        feedback.textContent = 'Please enter a valid 10-digit mobile number.';
                        feedback.style.display = 'block';
                    }
                    return;
                }

                // =========================================================================
                // BACKEND INTEGRATION POINT: Initiate Chat Session
                // Target Endpoint: POST /api/v1/chat/start
                // Payload: { name: name, mobile: mobile, email: email }
                // =========================================================================
                if (feedback) {
                    feedback.className = 'mg-livechat-feedback success';
                    feedback.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Connecting you with Meera...';
                    feedback.style.display = 'block';
                }

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Connecting...</span>';
                }

                setTimeout(function () {
                    if (feedback) {
                        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Connected! Starting conversation...';
                    }
                }, 1200);
            });
        }
    }

    initLiveChat();
    document.addEventListener('headerFooterReady', initLiveChat);

    // Document-level event delegation as an infallible touch fallback for async-loaded footer
    document.addEventListener('click', function (e) {
        var dockedTab = e.target.closest('#mg_docked_chat_tab');
        if (dockedTab) {
            e.preventDefault();
            e.stopPropagation();
            openLiveChat();
            return;
        }

        var minBtn = e.target.closest('#mg_livechat_minimize_btn');
        if (minBtn) {
            e.preventDefault();
            e.stopPropagation();
            closeLiveChat();
            return;
        }

        var closeChatBtn = e.target.closest('#mg_livechat_close_btn');
        if (closeChatBtn) {
            e.preventDefault();
            e.stopPropagation();
            closeLiveChat();
            return;
        }
    });

    /* ---------- Hamburger / mobile full-screen drawer menu ---------- */
    function initMobileDrawer() {
        var hamburger = document.getElementById('hamburger');
        var menu = document.getElementById('mobileMenu');
        var backdrop = document.getElementById('menuBackdrop');
        var closeBtn = document.getElementById('menuClose');
        if (!hamburger || !menu || !backdrop || !closeBtn) return;
        if (hamburger.dataset.drawerBound === '1') return;
        hamburger.dataset.drawerBound = '1';

        function openMenu() {
            menu.classList.add('open');
            backdrop.classList.add('visible');
            menu.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            backdrop.setAttribute('aria-hidden', 'false');
            closeBtn.focus();
            document.documentElement.style.overflow = 'hidden';
            document.body.classList.add('mg-drawer-open');

            // Senior Developer Note: Completely hide bottom navigation footer and floating widgets while side drawer is open
            var bottomNav = document.getElementById('mg_bottom_nav_bar') || document.querySelector('.mg-bottom-nav');
            if (bottomNav) bottomNav.classList.add('mg-hidden-by-drawer');

            var dockedTab = document.getElementById('mg_docked_chat_tab');
            if (dockedTab) dockedTab.classList.add('mg-hidden-by-drawer');

            var rateWidget = document.getElementById('rate_ticker_toggle_area') || document.querySelector('.mg-rate-float-widget');
            if (rateWidget) rateWidget.classList.add('mg-hidden-by-drawer');

            var stickyFilter = document.getElementById('mg_sticky_filter_sort') || document.querySelector('.mg-sticky-filter-sort-bar');
            if (stickyFilter) stickyFilter.classList.add('mg-hidden-by-drawer');

            var chatOpts = document.getElementById('mg_chat_options');
            if (chatOpts && chatOpts.classList.contains('open')) {
                chatOpts.classList.remove('open');
                chatOpts.style.display = 'none';
                chatOpts.style.pointerEvents = 'none';
            }

            var backToTop = document.querySelector('.back-to-top');
            if (backToTop) backToTop.classList.add('mg-hidden-by-drawer');

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
            document.body.classList.remove('mg-drawer-open');

            // Restore bottom navigation footer and floating widgets
            var bottomNav = document.getElementById('mg_bottom_nav_bar') || document.querySelector('.mg-bottom-nav');
            if (bottomNav) bottomNav.classList.remove('mg-hidden-by-drawer');

            var dockedTab = document.getElementById('mg_docked_chat_tab');
            if (dockedTab) dockedTab.classList.remove('mg-hidden-by-drawer');

            var rateWidget = document.getElementById('rate_ticker_toggle_area') || document.querySelector('.mg-rate-float-widget');
            if (rateWidget) rateWidget.classList.remove('mg-hidden-by-drawer');

            var stickyFilter = document.getElementById('mg_sticky_filter_sort') || document.querySelector('.mg-sticky-filter-sort-bar');
            if (stickyFilter) stickyFilter.classList.remove('mg-hidden-by-drawer');

            var backToTop = document.querySelector('.back-to-top');
            if (backToTop) backToTop.classList.remove('mg-hidden-by-drawer');
        }

        hamburger.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (menu.classList.contains('open')) closeMenu();
            else openMenu();
        });

        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeMenu();
        });
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
            }, { passive: true });
            menu.addEventListener('touchmove', function (e) {
                if (startX === null || startY === null) return;
                var currentX = e.touches[0].clientX;
                var currentY = e.touches[0].clientY;
                var dx = currentX - startX;
                var dy = Math.abs(currentY - startY);
                if (dx < -40 && Math.abs(dx) > dy * 1.5) {
                    closeMenu();
                    startX = null;
                    startY = null;
                }
            }, { passive: true });
            menu.addEventListener('touchend', function () {
                startX = null;
                startY = null;
            }, { passive: true });
        })();
    }
    initMobileDrawer();
    document.addEventListener('headerFooterReady', initMobileDrawer);

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

    /* ---------- Bottom Navigation Active Tab State Manager ---------- */
    function initBottomNavActiveState() {
        var path = window.location.pathname.toLowerCase();
        var activeId = 'mg_bottom_nav_home';

        if (path.indexOf('categories.html') !== -1) {
            activeId = 'mg_bottom_nav_categories';
        } else if (path.indexOf('cateloge.html') !== -1) {
            activeId = 'mg_bottom_nav_catalogue';
        } else if (path.indexOf('scheme.html') !== -1 || path.indexOf('scheme-details') !== -1) {
            activeId = 'mg_bottom_nav_plans';
        } else if (path.indexOf('shop.html') !== -1) {
            activeId = 'mg_bottom_nav_shop';
        } else if (path.indexOf('index.html') !== -1 || path === '/' || path.endsWith('/') || path === '') {
            activeId = 'mg_bottom_nav_home';
        }

        var navItems = document.querySelectorAll('.mg-bottom-nav-item');
        if (navItems && navItems.length > 0) {
            navItems.forEach(function (el) {
                el.classList.remove('active');
            });
            var activeEl = document.getElementById(activeId);
            if (activeEl) {
                activeEl.classList.add('active');
            }
        }
    }
    initBottomNavActiveState();
    document.addEventListener('headerFooterReady', initBottomNavActiveState);

    /* ---------- Bottom Navigation "Categories" Direct Navigation Handler ---------- */
    function initBottomNavCategories() {
        var catBottomBtn = document.getElementById('mg_bottom_nav_categories');
        if (catBottomBtn && !catBottomBtn.dataset.bound) {
            catBottomBtn.dataset.bound = '1';
            catBottomBtn.addEventListener('click', function () {
                if (window.location.pathname.indexOf('categories.html') === -1) {
                    window.location.href = 'categories.html';
                }
            });
        }
    }
    initBottomNavCategories();
    document.addEventListener('headerFooterReady', initBottomNavCategories);

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

    // =========================================================================
    // BACKEND INTEGRATION POINT: Add-to-Cart Micro-Interaction Controller
    // Target Endpoint: POST /api/v1/cart/items (or Laravel cart session route)
    // Behavior: Increments badge counter and displays animated toast without page reload.
    // =========================================================================
    var _toastTimer = null;
    window.showAddToCartToast = function (productTitle, quantity) {
        var toast = document.getElementById('mg_cart_toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'mg_cart_toast';
            toast.className = 'mg-cart-toast';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML =
                '<div class="mg-cart-toast-icon"><i class="fa fa-check"></i></div>' +
                '<div class="mg-cart-toast-content">' +
                    '<span class="mg-cart-toast-title">&#10003; Added to Cart</span>' +
                    '<span class="mg-cart-toast-desc" id="mg_cart_toast_desc">Item added to your bag</span>' +
                '</div>';
            document.body.appendChild(toast);
        }

        var desc = document.getElementById('mg_cart_toast_desc');
        if (desc) {
            var label = productTitle || 'Item';
            var qty = parseInt(quantity, 10) || 1;
            desc.textContent = (qty > 1) ? (label + ' (Qty: ' + qty + ')') : label;
        }

        // Clear any ongoing timer
        if (_toastTimer) {
            clearTimeout(_toastTimer);
            toast.classList.remove('mg-toast-visible');
            void toast.offsetWidth; // force reflow for re-trigger
        }

        toast.classList.add('mg-toast-visible');

        _toastTimer = setTimeout(function () {
            toast.classList.remove('mg-toast-visible');
        }, 2000);
    };

    window.updateCartBadgeCount = function (increment) {
        var addCount = parseInt(increment, 10) || 1;
        var badges = document.querySelectorAll('#kart_count, .badge#kart_count');
        badges.forEach(function (badge) {
            var current = parseInt(badge.textContent, 10) || 0;
            badge.textContent = current + addCount;
            badge.classList.remove('mg-badge-pop');
            void badge.offsetWidth;
            badge.classList.add('mg-badge-pop');
            setTimeout(function () {
                badge.classList.remove('mg-badge-pop');
            }, 450);
        });
    };

    function initAddToCartInteractions() {
        document.addEventListener('click', function (e) {
            // Only active on mobile viewports as requested
            if (window.innerWidth >= 992) return;

            var btn = e.target.closest(
                '#addtokart, .addtokart, a[href*="addtokart"], button[name="addtokart"], .btn-add-to-cart, .product_action_btn'
            );
            if (!btn) return;

            // If it's a generic product_action_btn, ensure it represents Add to Cart
            if (btn.classList.contains('product_action_btn') && !btn.classList.contains('addtokart')) {
                var hasCartIcon = btn.querySelector('.fa-shopping-cart');
                var text = (btn.textContent || '').trim().toLowerCase();
                if (!hasCartIcon && text.indexOf('cart') === -1) return;
            }

            e.preventDefault();
            e.stopPropagation();

            // Extract item title
            var itemTitle = '';
            var pdTitle = document.querySelector('.pd-info h3, #product_detail_page h3');
            if (pdTitle) {
                itemTitle = pdTitle.textContent.trim().split('(')[0].trim();
            } else {
                var card = btn.closest('.card, .product-item, .card-body, .product-card');
                if (card) {
                    var titleEl = card.querySelector('h6, .product_title, .card-title, .text-truncate');
                    if (titleEl) itemTitle = titleEl.textContent.trim();
                }
            }
            if (!itemTitle) itemTitle = 'Jewellery Item';

            // Extract quantity if on product detail page
            var quantInput = document.getElementById('quant');
            var qty = quantInput ? (parseInt(quantInput.value, 10) || 1) : 1;

            // Increment header badge & display micro-interaction toast
            window.updateCartBadgeCount(qty);
            window.showAddToCartToast(itemTitle, qty);

            // Button micro-interaction feedback (brief state change)
            var originalHtml = btn.innerHTML;
            btn.classList.add('mg-btn-added-state');
            btn.innerHTML = '<i class="fa fa-check mr-1"></i> Added!';

            setTimeout(function () {
                btn.innerHTML = originalHtml;
                btn.classList.remove('mg-btn-added-state');
            }, 1200);
        });
    }
    initAddToCartInteractions();

    // =========================================================================
    // BACKEND INTEGRATION POINT: Personalization - Recently Viewed Tracker
    // Target Endpoint: GET /api/v1/user/recently-viewed | POST /api/v1/user/recently-viewed
    // Behavior: Stores last 4-5 visited products in localStorage and renders as a
    // horizontal scroll row on mobile Home page. Hides completely if empty.
    // =========================================================================
    var RECENT_STORAGE_KEY = 'mg_recently_viewed';
    var MAX_RECENT_ITEMS = 5;

    // 1. Record Product View on Product Detail Pages
    function trackProductDetailView() {
        var pdPage = document.getElementById('product_detail_page');
        if (!pdPage) return;

        var titleEl = pdPage.querySelector('.pd-info h3');
        var priceEl = document.getElementById('bold_rate') || pdPage.querySelector('.pd-price-box h3');
        var imgEl = pdPage.querySelector('#product-carousel .carousel-item.active img, #product-carousel .carousel-item img');
        var productInput = pdPage.querySelector('input[name="product"]');

        if (!titleEl) return;

        var cleanTitle = titleEl.textContent.trim().split('(')[0].trim();
        var rawPrice = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '';
        var numPrice = parseFloat(rawPrice) || 0;
        var formattedPrice = numPrice > 0 ? ('₹' + Math.round(numPrice).toLocaleString('en-IN')) : 'Price on request';
        var imgSrc = imgEl ? (imgEl.getAttribute('src') || '') : '';
        var currentUrl = window.location.pathname.split('/').pop() || window.location.href;
        var productId = productInput ? productInput.value : currentUrl;

        var productObj = {
            id: productId,
            title: cleanTitle,
            price: formattedPrice,
            image: imgSrc,
            url: currentUrl,
            timestamp: Date.now()
        };

        try {
            var existing = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
            if (!Array.isArray(existing)) existing = [];

            // Remove existing duplicate if present
            existing = existing.filter(function (item) {
                return item.id !== productObj.id && item.url !== productObj.url;
            });

            // Add latest to front
            existing.unshift(productObj);

            // Cap at 5 items max
            if (existing.length > MAX_RECENT_ITEMS) {
                existing = existing.slice(0, MAX_RECENT_ITEMS);
            }

            localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(existing));
        } catch (e) {
            console.warn('Unable to persist recently viewed product:', e);
        }
    }
    trackProductDetailView();

    // 2. Render Recently Viewed Horizontal Track on Mobile Home
    function renderRecentlyViewed() {
        var section = document.getElementById('mg_recently_viewed_section');
        var track = document.getElementById('mg_recently_viewed_track');
        if (!section || !track) return;

        var items = [];
        try {
            items = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
        } catch (e) {
            items = [];
        }

        // If no products viewed yet, hide section entirely as requested
        if (!Array.isArray(items) || items.length === 0) {
            section.style.setProperty('display', 'none', 'important');
            track.innerHTML = '';
            return;
        }

        // Render cards
        var html = '';
        items.forEach(function (item) {
            var safeTitle = (item.title || 'Jewellery Item').replace(/"/g, '&quot;');
            var safePrice = item.price || '';
            var safeImg = item.image || 'assets/ecomm/products/rings/ring_1.webp';
            var safeUrl = item.url || '#';

            html +=
                '<div class="mg-recent-card" data-product-id="' + (item.id || '') + '">' +
                    '<a href="' + safeUrl + '" class="mg-recent-card-link">' +
                        '<div class="mg-recent-img-box">' +
                            '<img src="' + safeImg + '" alt="' + safeTitle + '" loading="lazy" onerror="this.src=\'assets/ecomm/products/rings/ring_1.webp\'">' +
                        '</div>' +
                        '<div class="mg-recent-body">' +
                            '<h6 class="mg-recent-title" title="' + safeTitle + '">' + safeTitle + '</h6>' +
                            '<div class="mg-recent-price">' + safePrice + '</div>' +
                        '</div>' +
                    '</a>' +
                '</div>';
        });

        track.innerHTML = html;
        section.style.setProperty('display', 'block', 'important');

        // Clear button handler
        var clearBtn = document.getElementById('mg_clear_recent_btn');
        if (clearBtn && !clearBtn.dataset.bound) {
            clearBtn.dataset.bound = '1';
            clearBtn.addEventListener('click', function (e) {
                e.preventDefault();
                try {
                    localStorage.removeItem(RECENT_STORAGE_KEY);
                } catch (err) {}
                section.style.transition = 'opacity 0.25s ease';
                section.style.opacity = '0';
                setTimeout(function () {
                    section.style.setProperty('display', 'none', 'important');
                    section.style.opacity = '';
                    track.innerHTML = '';
                }, 250);
            });
        }
    }
    renderRecentlyViewed();
    document.addEventListener('DOMContentLoaded', renderRecentlyViewed);

    // Testing Helpers (Available in DevTools for QA and Backend Team)
    window.seedMockRecentlyViewed = function () {
        var mockItems = [
            {
                id: '54',
                title: '22K Gold Filigree Bangles with Dual-Tone Detailing',
                price: '₹86,717',
                image: 'https://justudhari.com/ecom/products/1740131643523578087.jpg',
                url: 'product-detail-22k-gold-filigree-bangles-with-dual-tone-detailingaQXSjRikrT.html'
            },
            {
                id: '55',
                title: 'Pure 22K Gold Textured Oval Link Chain for Men',
                price: '₹1,73,433',
                image: 'https://justudhari.com/ecom/products/1740122848901485459.jpg',
                url: 'product-detail-pure-22k-gold-textured-oval-link-chain-for-menErucyNcP3G.html'
            },
            {
                id: '56',
                title: '22K Royal Gold Filigree Ring',
                price: '₹24,500',
                image: 'assets/ecomm/products/rings/ring_1.webp',
                url: 'product-detail-elegant-floral-gold-ring-for-womenKroCz9kxLF.html'
            },
            {
                id: '57',
                title: 'Royal Gold Choker Necklace with Intricate Net Design',
                price: '₹1,42,800',
                image: 'https://justudhari.com/ecom/products/1740135726115621763.jpg',
                url: 'product-detail-royal-gold-choker-necklace-set-with-intricate-net-designCQHdUCwX4y.html'
            }
        ];
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(mockItems));
        renderRecentlyViewed();
    };

    window.clearRecentlyViewed = function () {
        localStorage.removeItem(RECENT_STORAGE_KEY);
        renderRecentlyViewed();
    };

    // =========================================================================
    // BACKEND INTEGRATION POINT: Mobile Image Skeleton & Progressive Loader
    // Target Endpoint: Dynamic listing APIs (e.g. GET /api/v1/products)
    // Behavior: Shows a luxury animated grey shimmer on image containers while
    // loading, and smoothly fades in the image with zero layout shift on mobile.
    // =========================================================================
    function initImageSkeletonLoaders(scope) {
        if (window.innerWidth > 991.98) return;

        var root = scope || document;
        var selector = [
            '#shop_data .product-item .product-img',
            '.card.product-item .product-img',
            '.mg-wishlist-thumb-wrap',
            '.mg-recent-img-box',
            '#product_detail_page #product-carousel .carousel-item',
            '#product_detail_page #pd_thumbnails .pd-thumb'
        ].join(', ');

        var containers = root.querySelectorAll(selector);
        containers.forEach(function (container) {
            var img = container.querySelector('img');
            if (!img) return;

            if (img.dataset.skeletonBound === 'true') {
                if (img.complete && img.naturalWidth > 0) {
                    img.classList.add('mg-img-loaded');
                    container.classList.remove('mg-skeleton-active');
                }
                return;
            }
            img.dataset.skeletonBound = 'true';

            if (img.complete && img.naturalWidth > 0) {
                img.classList.add('mg-img-loaded');
                container.classList.remove('mg-skeleton-active');
            } else {
                container.classList.add('mg-skeleton-active');
                img.classList.remove('mg-img-loaded');

                var handleDone = function () {
                    img.removeEventListener('load', handleDone);
                    img.removeEventListener('error', handleDone);
                    img.classList.add('mg-img-loaded');
                    container.classList.remove('mg-skeleton-active');
                };

                img.addEventListener('load', handleDone);
                img.addEventListener('error', handleDone);
            }
        });
    }

    initImageSkeletonLoaders();
    document.addEventListener('DOMContentLoaded', function () {
        initImageSkeletonLoaders();
    });
    window.addEventListener('load', function () {
        initImageSkeletonLoaders();
    });

    if (window.MutationObserver) {
        var gridObserver = new MutationObserver(function (mutations) {
            var shouldInit = false;
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) shouldInit = true;
            });
            if (shouldInit) initImageSkeletonLoaders();
        });
        var observeTargets = [
            document.getElementById('shop_data'),
            document.getElementById('mg_wishlist_cards_list'),
            document.getElementById('pd_thumbnails'),
            document.querySelector('#product-carousel .carousel-inner')
        ];
        observeTargets.forEach(function (target) {
            if (target) {
                gridObserver.observe(target, { childList: true, subtree: true });
            }
        });
    }

    window.initImageSkeletonLoaders = initImageSkeletonLoaders;

    // Simulation helper for QA/DevTools verification
    window.simulateSkeletonLoading = function (durationMs) {
        var duration = durationMs || 2500;
        var selector = [
            '#shop_data .product-item .product-img',
            '.card.product-item .product-img',
            '.mg-wishlist-thumb-wrap',
            '.mg-recent-img-box',
            '#product_detail_page #product-carousel .carousel-item',
            '#product_detail_page #pd_thumbnails .pd-thumb'
        ].join(', ');

        var containers = document.querySelectorAll(selector);
        containers.forEach(function (container) {
            var img = container.querySelector('img');
            if (!img) return;
            container.classList.add('mg-skeleton-active');
            img.classList.remove('mg-img-loaded');
            setTimeout(function () {
                img.classList.add('mg-img-loaded');
                container.classList.remove('mg-skeleton-active');
            }, duration);
        });
        console.log('[MG Skeleton] Simulating image skeleton shimmer for ' + duration + 'ms on ' + containers.length + ' containers.');
    };

})();


