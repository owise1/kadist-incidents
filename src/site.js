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

  $('body')
    .on('click', '.audio', function (){
      if ($(this).is('.playing')) {
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
      }
      $(this).toggleClass('playing')

    })
    .on('click', '.text,.caption', function (){
      if ($(this).hasClass('active')) {
        $('.cover').removeClass('active')
      } else {
        $('.text,.caption').removeClass('active')
        $('.cover').addClass('active')
      }
      $(this).toggleClass('active')
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
      $('.parallax-window').each(function (){
        let pos = $(this).offset().top - $(window).scrollTop()
        let thisCenter = pos + c
        $(this).css({
          backgroundPosition : '50% ' + (-(c - thisCenter)/10) + 'px'
        })
      })
      // snapping
      if (_tout) _tout = clearTimeout(_tout)
      _tout = setTimeout(() => {
        let threshold = 100
        let withinTurnOffTextThreshold = true
        $('.parallax-window').each(function (){
          let top = $(this).offset().top - $(window).scrollTop()
          if (top !== 0 && Math.abs(top) < threshold) {
            $('html,body').animate({ scrollTop : $(this).offset().top + 'px' }, 300)
          }

          // turn off commentary
          if (top < 200) {
            withinTurnOffTextThreshold = false
          }
        })
        if (withinTurnOffTextThreshold) {
          // $('.text,.caption').removeClass('active')
        }
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
