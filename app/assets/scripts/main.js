$(function() {
  $.fn.redraw = function() {
    var el = this.get(0);
    el && el.offsetHeight;
    return this;
  };

  document.addEventListener('touchstart', function(){}, true);
  FastClick.attach(document.body);

  var cardCount = $('.card').length,
      cardHeight,
      cardTops,
      cardQuarters,
      cardMids,
      windowWidth;

  function nextCard() {
    var $dot = $('.card-dot.active').next();
    if (!$dot.hasClass('card-jump')) {
      $dot.trigger('click');
    } else {
      $('.js-to-next').trigger('click');
    }
  }
  function prevCard() {
    $('.card-dot.active').prev().trigger('click');
  }

  $('.down').on('click', nextCard);
  $('.js-prev-card').on('click', prevCard);
  $('.js-next-card').on('click', nextCard);
  $('.card-dot').on('click', function(e) {
    var index = $(e.currentTarget).index('.card-dot');
    var top = cardTops[index];

    if (Modernizr.touch) {
      $activeCard = $('.cards.active .card:eq(' + index + ')');
      touchTranslated = -top;
       $('.cards.active').css({
        'transform': 'translate3d(0,' + touchTranslated + 'px,0)',
        'transition': 'all .35s'
      });

      $('.card-dot.active').removeClass('active');
      var $activeDot = $('.card-dot:eq(' + index + ')');
      if (!$activeDot.length) {
        $activeDot = $('.card-dot:last');
      }
      $activeDot.addClass('active');
    } else {
      $('html, body').animate({scrollTop: top}, 450);
    }
  });
  $('.heart').on('click', function(e) {
    var $target = $(e.currentTarget).find('.icon-heart');
    $target.addClass('liked');
    setTimeout(function() {
      $(e.currentTarget).addClass('has-liked');
      $(e.currentTarget).css({
        'background-image': 'url(https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/t1/c66.66.828.828/s160x160/537884_4055053381933_824044467_n.jpg)'
      });
    }, 1250);
  });
  $('.js-to-next').on('click', function(e) {
    if (Modernizr.touch) {
      nextStory();
      $activeCard = $('.cards.active .cover');
      touchTranslated = 0;
      $('.cards.active').css({
        'transform': 'translate3d(0,' + touchTranslated + 'px,0)',
        'transition': 'all .2s'
      });
    } else {
      var diff = $('.js-to-next').offset().top;
      $('html, body').animate({scrollTop: diff}, 450);
    }
  });
  $(window).on('keyup', function(e) {
    if (e.which == 39) {
      nextCard();
    } else if (e.which == 37) {
      prevCard();
    }
  });
  if (Modernizr.touch) {
    $('.logo').on('click', function(e) {
      e.stopPropagation();
      $('.logo').addClass('active').redraw();
      $('.site-nav').addClass('active');
      $('.site-nav-glass').show().redraw().addClass('active');
    });
    $('.site-nav-glass').on('click', function(e) {
      $('.logo').removeClass('active');
      $('.site-nav').removeClass('active');
      $('.site-nav-glass').removeClass('active').hide();
    });
  } else {
    var logoTimeout;
    $('.logo').on('mouseenter', function(e) {
      clearTimeout(logoTimeout);
      $('.logo').addClass('active').redraw();
      $('.site-nav').addClass('active');
    });
    $('.logo').on('mouseleave', function(e) {
      logoTimeout = setTimeout(function() {
        $('.logo').removeClass('active');
        $('.site-nav').removeClass('active');
      }, 125);
    });
  }

  function updateCardTops() {
    cardHeight = $(window).height();
    windowWidth = $(window).width();
    cardTops = [];
    cardMids = [];
    cardQuarters = [];
    for (var i = 0; i < cardCount; i++) {
      cardTops.push(i * cardHeight);
      cardQuarters.push((i * cardHeight) + (cardHeight * .6666));
      cardMids.push((i * cardHeight) + (cardHeight / 2));
    }
  };
  updateCardTops();

  function nextStory() {
    $('.cards.first').remove();
    $('.cards.second').addClass('active').show();
    $('.card-dot:eq(2)').remove();
    $('.card-dot:eq(2)').remove();
    $('.card-dot:eq(2)').remove();
    $('html, body').redraw().scrollTop(0);
  }

  var prevActive = -1,
      prevQuarterActive = -1,
      prevMidActive = -1,
      activeIndex = 0,
      activeQuarterIndex = 0,
      activeMidIndex = 0,
      $activeCard = $('.cards.first .active'),
      $nextCard,
      $prevCard;

  $(window).on('scroll', function() {
    var scrollTop = $(window).scrollTop(),
        lowest = Infinity,
        lowestQuarter = Infinity,
        lowestMid = Infinity,
        diff,
        diffPercent,
        $video;

    var i = cardTops.length - 1;
    for(; i >= 0; i--) {
      if (scrollTop < lowest) {
        lowest = cardTops[i];
        activeIndex = i;
      }
      if (scrollTop < lowestQuarter && cardQuarters[i] > scrollTop) {
        lowestQuarter = cardQuarters[i];
        activeQuarterIndex = i;
      }
      if (scrollTop < lowestMid && cardMids[i] > scrollTop) {
        lowestMid = cardMids[i];
        activeMidIndex = i;
      }
    }
    diff = scrollTop - lowest;
    diffPercent = (diff / cardHeight);

    $activeCard = $('.cards.active .card:eq(' + activeIndex + ')');
    $prevCard = $activeCard.prev();
    $nextCard = $activeCard.next();
    if (prevActive != activeIndex) {
      prevActive = activeIndex;
      if ($activeCard.hasClass('next') && !$activeCard.hasClass('split')) {
        nextStory();
        return;
      }
      if ($nextCard.hasClass('video')) {
        // play video
        $video = $nextCard.find('video');
        $video.addClass('playing')[0].play();
        $video.prop('muted', true);
      }
      if ($prevCard.hasClass('video')) {
        // stop video
        // $video = $prevCard.find('video');
        // $video.removeClass('playing')[0].pause();
      }
      $('.card.active').removeClass('active');
      $activeCard.addClass('active passed');
    }
    if (prevQuarterActive != activeQuarterIndex) {
      prevQuarterActive = activeQuarterIndex;
      $('card.coming-up').removeClass('coming-up');
      $('.cards.active .card:eq(' + activeQuarterIndex + ')').addClass('coming-up');
    }
    if (prevMidActive != activeMidIndex) {
      prevMidActive = activeMidIndex;
      $('.card-dot.active').removeClass('active');
      var $activeDot = $('.card-dot:eq(' + activeMidIndex + ')');
      if (!$activeDot.length) {
        $activeDot = $('.card-dot:last');
      }
      $activeDot.addClass('active');
    }
    if (Modernizr.touch) {
      return;
    }
    if (diffPercent >= 0) {
      // $activeCard.find('.bg').css({
      //   'background-position': '50% ' + (diffPercent * 100) + '%'
      // });
    } else {
      var opacityDiff = diffPercent * 10;
      var scaleDiff = (1 - (diffPercent * 3));
      $activeCard.find('.bg.normal').css({
        opacity: Math.min(.70 + opacityDiff, .70),
        'transform': 'scale(' + scaleDiff + ')'
      });
      $activeCard.find('.bg.blurred').css({
        opacity: Math.min(-opacityDiff, .70),
        'transform': 'scale(' + scaleDiff + ')'
      });
    }

    var $parallaxContent,
        parallaxSpeed,
        contentOffset,
        cotentBottomDiff,
        diffWithSpeed,
        translated,
        translate;

    var nextTranslate = diffPercent / 2;
    var opacityDiff = diffPercent;
    var scaleDiff = 1 + (.6 - (diffPercent * .6));
    var scaleDiffInverse = 1 - (.5 - (diffPercent * .5));

    $activeCard.find('.js-parallax-content').each(function() {
      $parallaxContent = $(this);
      parallaxSpeed = parseFloat($parallaxContent.data('speed'), 10) || 1;
      translated = parseInt($parallaxContent.attr('data-translated'), 10) || 0;
      contentOffset = $parallaxContent.offset().top - lowest;
      cotentBottomDiff = (cardHeight - contentOffset - $parallaxContent.height()) + translated;
      diffWithSpeed = diffPercent * parallaxSpeed;
      translate = (cotentBottomDiff * diffWithSpeed);
      if (diffWithSpeed >= 0) {
        $parallaxContent.css({
          opacity: 1 - diffWithSpeed,
          transform: 'translate3d(0,' + translate + 'px,0)'
        }).attr('data-translated', translate);
      }
    });
    if ($nextCard.hasClass('next')) {
      $nextCard.find('.bg.blurred').css({
        opacity: .70 - (opacityDiff * .70),
        'transform': 'scale(' + scaleDiff + ')'
      });
      $nextCard.find('.bg.normal').css({
        opacity: (opacityDiff * .70),
        'transform': 'scale(' + scaleDiff + ')'
      });
      $parallaxContent = $nextCard.find('.js-parallax-content');
      nextTranslate = (nextTranslate * cardHeight) - (($parallaxContent.find('.next-content').height() * scaleDiff) / 2);
      nextTranslate = Math.max(nextTranslate, 0);
      $parallaxContent.css({
        opacity: diffPercent + .25,
        transform: 'translate3d(0,' + nextTranslate + 'px,0) scale(' + scaleDiffInverse + ')'
      });
    }
    if ($nextCard.hasClass('split')) {
      nextTranslate = windowWidth - ((windowWidth * diffPercent) + (cardHeight * .30));
      nextTranslate = Math.max(0, nextTranslate);
      $nextCard.find('.half-left').css({
        transform: 'translate3d(-' + nextTranslate + 'px,0,0)'
      });
      $nextCard.find('.half-right').css({
        transform: 'translate3d(' + nextTranslate + 'px,0,0)'
      });
      $parallaxContent = $nextCard.find('.js-parallax-content');
      $parallaxContent.css({
        opacity: 1 - diffPercent,
        transform: 'translate3d(0,' + ((diffPercent * cardHeight) * .5) + 'px,0)'
      });
    }
    if ($activeCard.hasClass('split')) {
      scaleDiff = 1 + (diffPercent * 3);
      $activeCard.find('.bg.normal').css({
        'transform': 'scale(' + scaleDiff + ')'
      });
    }
  });

  $(window).on('resize', updateCardTops);

  var oldY, oldX, oldHeight, oldWidth;
  $('.js-zoomable').on('click', function(e) {
    var $target = $(e.currentTarget),
        offset = $target.offset(),
        scrollTop = $(window).scrollTop(),
        windowHeight = $(window).height(),
        windowWidth = $(window).width(),
        nativeWidth = $target.data('width'),
        nativeHeight = $target.data('height'),
        maxWidowSize,
        newSizeX,
        newSizeY,
        sizeRatio;

    oldY = offset.top - scrollTop;
    oldX = offset.left;
    oldHeight = $target.height();
    oldWidth = $target.width();

    if (Modernizr.touch) {
      maxWidowSize = .95;
    } else {
      maxWidowSize = .9;
    }

    var src = $target.attr('src') || $target.css('background-image');
    src = src.replace('url(', '').replace(')', '');

    $('body').append(
      '<div class="zoom-wrap inserted">' +
        '<div class="zoom-bg"></div>' +
        '<div class="zoom-content">' +
          '<div class="border-highlight dark"></div>' +
        '</div>' +
      '</div>'
    ).addClass('modal');
    $('.zoom-content').css({
      'background-image': 'url(' + src +')',
      height: oldHeight,
      width: oldWidth,
      top: oldY,
      left: oldX
    }).redraw();

    if (nativeWidth) {
      // Calculate resize ratios for resizing
      var ratioW = (windowWidth * maxWidowSize) / nativeWidth;
      var ratioH = (windowHeight * maxWidowSize) / nativeHeight;

      // smaller ratio will ensure that the image fits in the view
      var ratio = ratioW < ratioH ? ratioW : ratioH;

      newSizeX = nativeWidth * ratio;
      newSizeY = nativeHeight * ratio;
    } else {
      newSizeX = windowHeight * maxWidowSize;
      newSizeY = windowHeight * maxWidowSize;
      if (newSizeX > windowWidth * .95) {
        newSizeX = windowWidth * .95;
        newSizeY = windowWidth * .95;
      }
    }

    var newX = ((windowWidth / 2) - (newSizeX / 2));
    var newY = ((windowHeight / 2) - (newSizeY / 2));

    $('.zoom-wrap').redraw().removeClass('inserted');
    $('.zoom-content').css({
      width: newSizeX + 'px',
      height: newSizeY + 'px',
      top: newY + 'px',
      left: newX + 'px'
    });
  });

  var touchStartY = 0,
      touchDiff = 0,
      touchTranslated = 0,
      hasMoved = false;

  $(window).on('touchstart', function(e) {
    hasMoved = false;
    touchStartY = e.originalEvent.touches[0].pageY;
    $('.cards.active').css('transition', '');

    if (touchTranslated === 0) {
      $('.cards.active .active .card-content').css({
        'transition': ''
      });
      $('.cards.active .active .bg').css({
        'transition': ''
      });
    }
  });

  $(window).on('touchend', function(e) {
    var activeIndex = 0;

    if (!hasMoved) {
      return;
    }
    touchTranslated += touchDiff;

    // Up
    if (touchDiff > 0) {
      $activeCard = $activeCard.prev();
    } else if (touchDiff < 0) {
      // Down
      $activeCard = $activeCard.next();
    } else {
      touchTranslated = 0;
      $('.cards.active .active .card-content').css({
        'transform': 'translate3d(0,0,0)',
        'transition': 'all .15s'
      });
      $('.cards.active .cover .bg.blurred').css({
        opacity: 0,
        'transition': 'all .15s'
      });
      $('.cards.active .cover .bg.normal').css({
        opacity: .7,
        'transition': 'all .15s'
      });
    }

    if ($activeCard.hasClass('js-to-next')) {
      $('.js-to-next').trigger('click');
      return;
    }

    activeIndex = $activeCard.index();
    touchTranslated = -(activeIndex * cardHeight);
    $('.cards.active').css({
      'transform': 'translate3d(0,' + touchTranslated + 'px,0)',
      'transition': 'all .2s'
    });

    $('.card-dot.active').removeClass('active');
    var $activeDot = $('.card-dot:eq(' + activeIndex + ')');
    if (!$activeDot.length) {
      $activeDot = $('.card-dot:last');
    }
    $activeDot.addClass('active');
  });

  $(window).on('touchmove', function(e) {
    var moveY = e.originalEvent.touches[0].pageY,
        diffPercent,
        diff;

    hasMoved = true;
    touchDiff = (moveY - touchStartY);
    diff = touchTranslated + touchDiff;
    diffPercent = touchDiff / cardHeight;
    var opacityDiff = diffPercent * 2.5;
    var scaleDiff = (1 + (diffPercent / 2));


    if (diff > 0) {
      touchDiff = 0;
      // $('.cards.active .active .card-content').css({
      //   'transform': 'translate3d(0,' + diff + 'px,0)'
      // });
      // $('.cards.active .cover .bg.blurred').css({
      //   opacity: Math.min((opacityDiff * .70), .7),
      // });
      // $('.cards.active .cover .bg.normal').css({
      //   opacity: .70 - (opacityDiff * .70),
      // });
    } else {
      e.preventDefault();
      $('.cards.active').css({
        'transform': 'translate3d(0,' + diff + 'px,0)'
      });
    }
  });

  $('body').on('click', '.zoom-wrap', function(e) {
    var $target = $('.zoom-wrap');
    $('body').removeClass('modal').redraw();
    $target.addClass('inserted').redraw();
    $('.zoom-content').css({
      height: oldHeight,
      width: oldWidth,
      top: oldY,
      left: oldX
    });
    setTimeout(function() {
      $('.zoom-wrap').remove();
    }, 350);
  });

  $('body').removeClass('loading');
  setTimeout(function() {
    $('body').removeClass('init');
  }, 500);
});
