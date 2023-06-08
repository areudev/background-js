navigator.serviceWorker.register('/sw.js')

// Page Visibility API
let backgroundInitialTimeStamp
window.addEventListener('visibilitychange', event => {
  if (document.visibilityState === 'hidden') {
    const now = new Date().toLocaleTimeString()
    log(`Going to the background at ${now}`)
    backgroundInitialTimeStamp = performance.now()
  } else {
    const timeElapsed = parseInt(performance.now() - backgroundInitialTimeStamp)
    log(`Returning from the background after ${timeElapsed / 1000}s`)
  }
})

// Beacon
document.getElementById('btnBeacon').addEventListener('click', event => {
  const data = {
    message: 'Hello from the background yo!',
  }
  const blob = new Blob([JSON.stringify(data)], {type: 'application/json'})
  navigator.sendBeacon('/log', blob)
})

// Background Sync
document.getElementById('btnSync').addEventListener('click', async event => {
  const swRegistration = await navigator.serviceWorker.ready
  swRegistration.sync.register('like')
})

// Background Periodic Sync
document
  .getElementById('btnPeriodicSync')
  .addEventListener('click', async event => {
    const swRegistration = await navigator.serviceWorker.ready
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync',
    })
    if (status.state == 'granted') {
      swRegistration.periodicSync.register('dailynews', {
        minInterval: 60 * 60 * 1000,
      })
    } else {
      console.log('Periodic Background Sync permission not granted')
    }
  })

// Background Fetch
document.getElementById('btnFetch').addEventListener('click', async event => {
  const registration = await navigator.serviceWorker.ready
  const bgFetch = await registration.backgroundFetch.fetch(
    'media-fetch',
    ['/media/vince.png', '/media/audio.mp3'],
    {
      title: 'My Background Fetch',
      icons: [
        {
          src: '/media/vince.png',
          sizes: '256x256',
          type: 'image/png',
        },
      ],
      downloadTotal: 1,
    }
  )
  bgFetch.addEventListener('progress', event => {
    log(`Background Fetch progress: ${event.downloaded} / ${event.total}`)
  })
  bgFetch.addEventListener('abort', event => {
    log(`Background Fetch aborted: ${event}`)
  })
  bgFetch.addEventListener('error', event => {
    log(`Background Fetch error: ${event}`)
  })
  bgFetch.addEventListener('success', event => {
    log(`Background Fetch success: ${event}`)
  })
})
