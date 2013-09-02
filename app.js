var restify = require('restify'),
s = require('save')('element'),
io = require('socket.io');

// Insert into DB and push update to active clients
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
    
    return next();
}

// Get list of every changed doc from db
function allDocs(req, res, next) {
    s.find({}, function(error, docs) {
	res.send(docs);
    });

    return next();
}

function homePage(req, res, next) {
    res.write('<html><head><meta name="google-site-verification" content="UzTC0r-dhCeoAdAGGjEhscxDE7aMcoTJ3haZVqYcZE8" /></\
head><body><h1>Hello, World!</h1></body></html>');
    res.end();
    return next();
}

var server = restify.createServer({
    name: 'Realtime-API-Test',
});

socket = io.listen(server);

server.get('/docPush/:doc', docPush);
server.get('/allDocs/', allDocs);
server.get('/', homePage);

server.listen(8084, function() {
    console.log("%s listening at URL %s", server.name, server.url);
});
