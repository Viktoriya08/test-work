$(document).ready(function(){
  $('.reviews__slick').slick({
    slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
              breakpoint: 600,
              settings: {
                arrows: false,
                dots: true,
                slidesToShow: 1,
                slidesToScroll: 1
              }
            },
          ] 
  });


  $('.cases__item').click(function(){
    $('.cases__item').removeClass('cases__item--active');
    $(this).addClass('cases__item--active');
    var itemid = $(this).prop('id');
    $(this).closest(".cases").find('.cases__wrap').each(function(){
       if($(this).data('id') == itemid ){
        $(this).addClass("cases__wrap--active");
       } else {
        $(this).removeClass("cases__wrap--active");
       }
    });
  });

  $('.cases__button--right').click(function(e){
    var $current = $('.cases__item.cases__item--active'); 
    if ($current.index() ==  $('.cases__item').length - 1) {
        return
    }
    $current.removeClass('cases__item--active');
    $current.next('.cases__item').addClass('cases__item--active');
    var itemid = $('.cases__item.cases__item--active').prop('id');
    $('.cases__wrap').each(function(){
        if($(this).data('id') == itemid ){
            $(this).addClass("cases__wrap--active");
           } else {
            $(this).removeClass("cases__wrap--active");
           }    
    });
  });
  $('.cases__button--left').click(function(e){
      var $current = $('.cases__item.cases__item--active');
      if ($current.index() ==  0) {
          return
      }
      $current.removeClass('cases__item--active');
      $current.prev('.cases__item').addClass('cases__item--active');
      var itemid = $('.cases__item.cases__item--active').prop('id');
      $('.cases__wrap').each(function(){
          if($(this).data('id') == itemid ){
              $(this).addClass("cases__wrap--active");
            } else {
              $(this).removeClass("cases__wrap--active");
            }    
      });
  });
/* sotrby */
  $('.sotrby').click(function(e){
    $('.sotrby').toggleClass('active');
    $('.sotrby__list').toggleClass('active');
  })

  $(document).on('keyup', function(e) {
    if ( e.key == "Escape" ) {
      $( ".sotrby" ).removeClass('active');
      $('.sotrby__list').removeClass('active');
    }
  });

  $(document).mouseup( function(e){ // событие клика по веб-документу
		var div = $( ".sotrby" ); // тут указываем ID элемента
		if (!div.is(e.target) // если клик был не по нашему блоку
        && div.has(e.target).length === 0) { //  не по его дочерним элементам
          $('.sotrby').removeClass('active');
          $('.sotrby__list').removeClass('active'); // скрываем его
		}
	});

/* recentworks__item */
  $('.recentworks__item:not(.recentworks__item.sotrby)').click(function(e){
    $('.recentworks__item').removeClass('recentworks__item--active').removeClass('main__romb');
    $(this).addClass('recentworks__item--active').addClass('main__romb');
  });

/* navigation__box */

  $(".navigation__box").click(function(e){
    $(".navigation__box").toggleClass("active");
    $(".navigation__list").toggleClass("active");
  });
  $(".navigation__item").click(function(e){
    $(".navigation__item").removeClass("active");
    $(this).addClass("active");
  });

/* fancybox */
  $("[data-fancybox]").fancybox();

/* map */
  
  $(".map__address-box--head").click(function(e){
    $(this).find(".map__office-line").toggleClass("open");
    $(this).children(".map__address").toggleClass("open");
  });
  $(".map__address-box--branch").click(function(e){
    $(this).find(".map__office-line").toggleClass("open");
    $(this).children(".map__address").toggleClass("open");
  });

/* прокручиваем страницу к требуемому элементу */
  $(".navigation__item a, .footer__list a").click(function(e) {
    var el = $(this);
    var dest = el.attr('href'); // получаем направление
    $('html').animate({ 
      scrollTop: $(dest).offset().top // прокручиваем страницу к требуемому элементу
    }, 800 // скорость прокрутки
    );
  });

})
