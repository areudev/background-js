const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')
const nedb = require('nedb')
const db = new nedb({filename: 'users.db', autoload: true})

app.use('/', express.static('public'))

app.post('/log', bodyParser.json(), function (req, res) {
  const data = req.body
  console.log('Data log received:')
  console.log(data)
})

app.post('/push/subscribe', bodyParser.json(), function (req, res) {
  const subscription = req.body
  let endpointParts, registrationId, endpoint

  if (
    subscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') ==
    0
  ) {
    endpointParts = subscription.endpoint.split('/')
    registrationId = endpointParts[endpointParts.length - 1]
    endpoint = 'https://android.googleapis.com/gcm/send'
    savePushUser('gcm', subscription.endpoint, registrationId, null)
  } else {
    savePushUser('webpush', subscription.endpoint, null, subscription.keys)
  }
  res.writeHead(200)
  res.write('OK')
})

function savePushUser(type, endpoint, id, keys) {
  db.count({endpoint: endpoint}, function (err, count) {
    if (count == 0) {
      const pushUser = {
        type: type,
        endpoint: endpoint,
        keys: keys,
      }
      db.insert(pushUser, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('New user saved')
        }
      })
    } else {
      console.log('The user was already in the system')
    }
  })
}

const server = app.listen(4000, function () {
  const host =
    server.address().address == '::' ? 'localhost' : server.address().address
  const port = server.address().port

  console.log(`Server listening at http://${host}:${port}`)
})
