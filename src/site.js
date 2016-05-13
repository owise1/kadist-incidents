const Q = require('q')
const R = require('ramda')
const soundManager = require('./soundmanager2.js').soundManager
// require('jquery-panelsnap')
// require('parallax.js')

const soundcloudClientId = 'c4a4875052a77317635c5847302109cb'

soundManager.setup({
  url : '/audio/swf/',
  onready : function () {
  }
})

$(function (){
  let currentSound
  let moving = false

  function scrollToSlide($slide){
    moving = true
    $('html,body').animate({ scrollTop : $slide.offset().top + 'px' }, 300, function (){
      moving = false
    })
  }
  function turnEverythingOff() {
    $('body').removeClass('darker')
    $('.cover').removeClass('active')
    $('.text,.caption').removeClass('active').removeClass('hide')
  }

  $('body')
    .on('click', '.audio', function (){
      if ($(this).is('.playing')) {
        $('body').removeClass('playing')
        if (currentSound) {
          currentSound.pause()
          currentSound = false
        }
      } else {
        if ($(this).data('sound')) {
          $(this).data('sound').play()
        } else{
          let url = $(this).data('audio')
          let sound = soundManager.createSound({
            id : url,
            url : url,
            autoPlay: true,
            volume : 70,
            onplay : function () {
            }
          })
          $(this).data('sound', sound)
        }
        currentSound = $(this).data('sound')
        $('body').addClass('playing')
      }
      $(this).toggleClass('playing')

    })
    .on('click', '.text,.caption', function (){
      if ($(this).hasClass('active')) {
        $('.cover').removeClass('active')
        $('.text').removeClass('hide')
        $('body').removeClass('darker')
      } else {
        $('.text,.caption').removeClass('active')
        $('.cover').addClass('active')
        scrollToSlide($(this).closest('section'))
        if ($(this).is('.caption')) {
          $('.text').addClass('hide')
        }
      }
      $(this).toggleClass('active')
    })
    .on('click', 'h2.open.intro', function (){
      $('body').addClass('darker')
      $('.text.' + $(this).data('key')).click()
    })

  $(".parallax-window").each(function (){
    $(this).css({
      backgroundImage : 'url('+$(this).data('image-src')+')'
    })
  })

  let _tout = false
  $(window)
    .scroll(function (){
      // parallax
      var c = $(window).height() / 2
      var factor = 10
      let reachedTurnOffTextThreshold = true
      $('.parallax-window').each(function (){
        let pos = $(this).offset().top - $(window).scrollTop()
        let thisCenter = pos + c
        $(this).css({
          backgroundPosition : '50% ' + (-(c - thisCenter)/10) + 'px'
        })

        // turn off commentary
        if (Math.abs(pos) < 200) {
          reachedTurnOffTextThreshold = false
        }
      })
      if (reachedTurnOffTextThreshold && !moving) {
        turnEverythingOff()
      }
      // snapping
      if (_tout) _tout = clearTimeout(_tout)
      _tout = setTimeout(() => {
        let threshold = 100
        $('.parallax-window').each(function (){
          let top = $(this).offset().top - $(window).scrollTop()
          if (top !== 0 && Math.abs(top) < threshold) {
            scrollToSlide($(this))
          }

        })
      }, 80)
    })
    .resize(function (){

    })

  $('.audio')
    .each(function (){
      if (/soundcloud/.test($(this).data('audio'))) {
        let url = $(this).data('audio')
        let _this = this
        $.getJSON('http://api.soundcloud.com/resolve?url=' + url + '&format=json&consumer_key=' + soundcloudClientId + '&callback=?', function(playlist){
            $(_this).data('audio', playlist.stream_url + '?consumer_key=' + soundcloudClientId)
        })
      }
    })

  $('.menu').click(function(){
    $('body').toggleClass('open')
	});

})
