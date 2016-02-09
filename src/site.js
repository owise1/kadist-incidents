const Q = require('q')
const R = require('ramda')
const soundManager = require('./soundmanager2.js').soundManager
require('jquery-panelsnap')

const soundcloudClientId = 'c4a4875052a77317635c5847302109cb'

soundManager.setup({
  url : '/audio/swf/',
  onready : function () {
  }
})


$(function (){
  let currentSound

  $('body')
    .panelSnap({
    })
    .on('mouseenter', '.audio', function (){

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
    })
    .on('mouseleave', '.audio', function (){
      if (currentSound) {
        currentSound.pause()
        currentSound = false
      }
    })
    .on('mouseenter', '.text,.caption', function (){
      $('.cover').addClass('active')
    })
    .on('mouseleave', '.text,.caption', function (){
      $('.cover').removeClass('active')
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

  /*
  sound = soundManager.createSound({
    id : url, 
    url : url,
    autoPlay: true,
    volume : /morse/.test(url) ? 10 : 70,
    onplay : function () {
      d.resolve(h1)
    }
  })
  */

})
