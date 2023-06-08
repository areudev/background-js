if ('showNotification' in ServiceWorkerRegistration.prototype) {
  document.getElementById('push').style.display = 'block'
}

document
  .getElementById('btnPushSubscribe')
  .addEventListener('click', async event => {
    if ('showNotification' in ServiceWorkerRegistration.prototype) {
      console.log('showNotification is supported')
      const state = await Notification.requestPermission()
      if (state == 'granted') {
        console.log('Notification permission granted')
        const swRegistration = await navigator.serviceWorker.ready
        const details = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            'BErSN6jPGW06qsTZIsY2dE1J-bwZ3SA0961xcKnrLUPm7o1ys9ItZzJhL7LTfS1y015p-AaJTN0GH6KiUTCRq8Y',
        })
        console.log('Push subscription details', details)
        fetch('/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: details.endpoint,
            keys: {
              p256dh: arrayBufferToBase64(details.getKey('p256dh')),
              auth: arrayBufferToBase64(details.getKey('auth')),
            },
          }),
        })
        log('Web Push subscription successful')
      }
    }
  })

function arrayBufferToBase64(buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

// Snippet from https://www.npmjs.com/package/web-push
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
