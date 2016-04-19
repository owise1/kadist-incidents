const Q = require('q')
const R = require('ramda')
const soundManager = require('./soundmanager2.js').soundManager
// require('jquery-panelsnap')
require('parallax.js')

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
    .on('mouseenter', '.text,.caption', function (){
      $('.cover').addClass('active')
    })
    .on('mouseleave', '.text,.caption', function (){
      $('.cover').removeClass('active')
    })

  let _tout = false
  $(window).scroll(function (){
    if (_tout) _tout = clearTimeout(_tout)
    _tout = setTimeout(() => {
      let threshold = 100
      $('.parallax-mirror').each(function (){
        let top = parseInt($(this).css('top'))
        if (top !== 0 && Math.abs(top) < threshold) {
          let src = $(this).find('img').attr('src')
          let $section = $('.parallax-window[data-image-src="'+src+'"]')
          $('html,body').animate({ scrollTop : $section.offset().top + 'px' }, 300)
        }
      })
    }, 80)
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
