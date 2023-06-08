self.addEventListener('push', event => {
  console.log('Push message received', event)
  self.registration.showNotification('Hello', {
    body: 'This is a push message',
    icon: 'media/vince.png',
  })
})

self.addEventListener('sync', event => {
  if (event.tag == 'like') {
    console.log('Sync event received', event)
  } else {
    console.log(`Unrecognized sync event: ${event.tag}`)
  }
})

self.addEventListener('periodicsync', event => {
  if (event.tag == 'dailynews') {
    console.log('Periodic sync event received', event)
  } else {
    console.log(`Unrecognized periodic sync event: ${event.tag}`)
  }
})

self.addEventListener('backgroundfetchsuccess', event => {
  console.log('Background Fetch success: ', event)
})
