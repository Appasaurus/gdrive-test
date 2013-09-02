var express = restify = require('restify'),
s = require('save')('element'),
io = require('socket.io');

var server = restify.createServer({
    name : 'realtime-api-test'
});

sock = io.listen(server);

// Insert into DB and push updated metadata to active clients
function docPush(req, res, next) {
    res.send('Hello there, ' + req.params.doc + '!');
    
    if (req.params.doc === undefined) {
	return next(new restify.InvalidArgumentError('Doc argument must be supplied'))
    }
    
    // create new doc element in db
    s.create({ doc: req.params.doc }, function (error, item) {
	// Handle error in creating new doc item
	if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
	res.send(201, item)
    });

    sock.sockets.broadcast.emit('newData', {hello: 'another'});
    
    return next();
}

// Get list of every changed doc & associated metadata from db
function allDocs(req, res, next) {
    s.find({}, function(error, docs) {
	res.send(docs);
    });

    return next();
}

// route for Google site verification
function homePage(req, res, next) {
    res.write('<html><head><meta name="google-site-verification" content="UzTC0r-dhCeoAdAGGjEhscxDE7aMcoTJ3haZVqYcZE8" /></\
head><body><h1>Hello, World!</h1></body></html>');
    res.end();
    return next();
}

// client page
function client(req, res, next) {
    res.write('<html><head><script type="text/javascript" src="/socket.io/socket.io.js"></script><script type="text/javascript">var socket = io.connect("http://localhost:8084"); socket.on("newData", function(data) { console.log(data); } );</script></head></html>');
    res.end();
    return next();
}

server.listen(8084, function() {
    console.log("%s listening at URL %s", server.name, server.url);
});

server.get('/docPush/:doc', docPush);
server.get('/allDocs/', allDocs);
server.get('/client', client);
server.get('/', homePage);

sock.sockets.on('connection', function(socket) {
    socket.emit('newData', {hello: 'world'});
    console.log('pushed new data to client');
});

