const nedb = require('nedb')
const db = new nedb({filename: 'users.db', autoload: true})
const webpush = require('web-push')

// generate your own
// npx web-push generate-vapid-keys
const publicKey = 'oops'
const privateKey = 'oops'

webpush.setVapidDetails(
  'mailto:youremail@yourdomain.org',
  publicKey,
  privateKey
)

const message = process.argv[2] || 'This is a test push message from the server'

db.find({}, function (err, users) {
  users.forEach(function (user) {
    const pushSubscription = {
      endpoint: user.endpoint,
      keys: {
        auth: user.keys.auth,
        p256dh: user.keys.p256dh,
      },
    }
    const object = {
      text: message,
      customData: ['some', 'test', 'data'],
    }
    // We can send plain text or an object encoded as JSON string
    webpush
      .sendNotification(pushSubscription, JSON.stringify(object))
      .then(function () {
        console.log('Message sent to ' + user.endpoint.substring(140))
      })
      .catch(function (error) {
        if (error.statusCode >= 400) {
          // delete the user from the DB?
        }
        //            console.log(error);
      })
  })
})
