var restify = require('restify'),
s = require('save'),
io = require('socket.io');

function docPush(req, res, next) {
    res.send('Hello there, ' + req.params.name + '!');
    return next();
}

var server = restify.createServer({
    name: 'Realtime-API-Test',
});

socket = io.listen(server);

server.get('/pushup/:doc', docPush);

server.listen(8084, function() {
    console.log("%s listening at URL %s", server.name, server.url);
});
