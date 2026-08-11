(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
		
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
		
		
		
        $("#custo_main,#mob_custo_main").click(function (e) {
            e.preventDefault();
            $($(this).attr('href')).toggle();
        });

        // $(".address_tabs").click(function (e) {
        //     e.preventDefault();
        //     $(".shipping_address").hide();
        //     $(".address_tabs").removeClass('active');
        //     $(this).addClass('active');
        //     const id = $(this).attr('href');
        //     // $(id + "_radio").click();
        //     $(id).show();
        // });

        $('.address_tabs').click(function () {
            $(".shipping_address").hide();
            $(".address_tabs").removeClass('active');
            $(this).addClass('active');
            const id = $(this).attr('data-target');
            // $(id + "_radio").click();
            $(id).show();
        });
    });
    
	
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

$(document).ready(function(){
    
    $slider = $('ul.catalog.slides');
    var li_count = $slider.children().length;
    function slideleft(){
        var first = $slider.find('li.slide').eq(0);
        var first_hidden = first.clone();
        first.css('margin-left','-200px');
        $slider.append(first_hidden);
        first.remove();
    }
    function slideright(){
        var last = $slider.find('li.slide').eq(li_count-1);
        var last_hidden = last.clone();
        last.css('margin-right','-200px');
        $slider.prepend(last_hidden);
        last.remove();
    }

    $("#catalog-slide-left").click(function(){
        slideleft();
    });
    $("#catalog-slide-right").click(function(){
        slideright();
    });
    setInterval(slideleft, 2000);
});


/**-------------JS TO Bottom Help Menu--------------------------------- */
 document.querySelector(".help-icon").addEventListener("click", function () {
  let options = document.querySelector(".help-options");
  options.classList.toggle("open");
});
