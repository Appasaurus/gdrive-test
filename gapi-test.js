var googleAuth = require('google-oauth-jwt'),
    drive = require('google-drive');

function listFiles(token, callback) {
  drive(token).files().get(callback)
}

function callback(err, response, body) {
  if (err) return console.log('err', err)
  console.log('response', response)
  console.log('body', JSON.parse(body))
}

googleAuth.authenticate({
    email: '119038242422-p8im6b00d4l5qg7c001b9ehbj11lq3el@developer.gserviceaccount.com',
    keyFile: 'google-private-key.pem',
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
}, function (err, token) {
    if(err) {
	console.log("OAuth2 Authorization Failed");
	console.log(err);
    } else {
	console.log("Got OAuth2 Token: " + token);
	listFiles(token, callback);
    }
});
    

