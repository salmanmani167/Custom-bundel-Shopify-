  $(document).ready(function(){


   
    $(".custom-visibltiy-menua").click(function () {
        $(".menu-drawer__menu.has-submenu").toggleClass("visibility");
    });

    $(".menu-drawer__close-button").click(function () {
        $(".menu-drawer__menu.has-submenu").removeClass("visibility");
    });

     $(".custom-visibltiy-menua").click(function () {
        $(".menu-drawer").toggleClass("heightps");
    });

    $(".menu-drawer__close-button").click(function () {
        $(".menu-drawer").removeClass("heightps");
    });
    
   


  // Jab kisi mega menu par click karein to pehla '.custom-menu-ps' flex ho aur baqi sab hide ho
$('.mega-menu').each(function () {
    $(this).find('.mega-menu__list .link-ps .custom-menu-ps').css("display", "none");
    $(this).find('.mega-menu__list .link-ps:first-child .custom-menu-ps').css("display", "flex");

    // Pehle mega-menu__link ko active karein
    $('.cstm-ancr1').addClass('active-menu-cstm');
});

// Click event on '.mega-menu__link'
$('.mega-menu__link').click(function (e) {
    // Prevent default only if it's a mega-menu__link, not for inner links
    if (!$(this).closest('.custom-menu-ps').length) {
        e.preventDefault();
    }

    let parentMegaMenu = $(this).closest('.mega-menu'); // Get the parent mega menu
    let parentLinkPs = $(this).closest('.link-ps'); // Get the clicked menu item

    // Hide all '.custom-menu-ps' within this mega menu
    parentMegaMenu.find('.custom-menu-ps').css("display", "none");
    parentMegaMenu.find('.mega-menu__link').removeClass('active-menu-cstm');

    // Show the corresponding '.custom-menu-ps' of the clicked link as flex
    parentLinkPs.find('.custom-menu-ps').css("display", "flex");
    $(this).addClass('active-menu-cstm');
});



    
    $('.footer-block__heading.inline-richtext').click(function() {
    $(this).next('.footer-block__details-content').toggleClass('active');

    // Check if .footer-block__details-content has 'active' class, then toggle on heading
    if ($(this).next('.footer-block__details-content').hasClass('active')) {
        $(this).addClass('active');
    } else {
        $(this).removeClass('active');
    }
});


    
        $('.marquee-content').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 0,
            speed: 3000,
            cssEase: 'linear',
            infinite: true,
            arrows: false,
            dots: false,
            variableWidth: true
        });

    
       $('.main-image').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false, // Disable dots here
    fade: false,
    asNavFor: '.thumbnail-image'
  });

    
  $('.thumbnail-image').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: false, // Disable dots here as well
    centerMode: false,
    focusOnSelect: true,
    asNavFor: '.main-image'
  });


                    
    });


document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".price .price-item").forEach(function(priceElement) {
        priceElement.childNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim().toLowerCase().includes("from")) {
                node.textContent = node.textContent.replace(/from\s*/i, '');
            }
        });
    });





 document.querySelectorAll(".menu-drawer__menu-item.list-menu__item").forEach(function (item) {
        item.addEventListener("click", function () {
            this.classList.toggle("show-icon");
        });
    });

document.querySelectorAll('.mega-menu').forEach(menu => {
  menu.addEventListener('toggle', function() {
    document.body.classList.toggle('menu-open', document.querySelector('.mega-menu[open]') !== null);
  });
});







  
});




