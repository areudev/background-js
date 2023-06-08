// Media playing
document.getElementById('btnPlay').addEventListener('click', event => {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Too Much Funk',
    artist: 'Vince Oaks',
    album: 'Slime Records',
    artwork: [
      {
        src: '/media/vince.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  })
  document.querySelector('audio').play()
})
document.getElementById('btnStop').addEventListener('click', event => {
  document.querySelector('audio').pause()
})

// PiP
document.getElementById('btnPiP').addEventListener('click', event => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture()
    return
  }
  document.querySelector('video').requestPictureInPicture()
})
