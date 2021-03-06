var express = require('express');
var app = express();
var session = require('express-session');
var nedbstore = require('nedb-session-store')(session);
var https = require('https');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
const uuidV1 = require('uuid/v1');

app.use(
	session(
		{
			secret: 'secret',
			cookie: {
				 maxAge: 365 * 24 * 60 * 60 * 1000   // e.g. 1 year
				},
			store: new nedbstore({
			 filename: 'sessions.db'
			})
		}
	)
);

app.set('view engine', 'ejs');
app.use(express.static('public'));

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedParser);

var Datastore = require('nedb');
var db = new Datastore({filename:'user.db', autoload: true});
var db2 = new Datastore({filename: 'database.json', autoload: true});

//The default route of / and what to do
app.get('/', function(req,res) {
});

var credentials = {
	key: fs.readFileSync('star_itp_io.key'),
	cert: fs.readFileSync('star_itp_io.pem')
  };

var httpsServer = https.createServer(credentials, app);

function generateHash(password) {
    return bcrypt.hashSync(password);
}
function compareHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}	
app.get('/', function(req, res) {
	console.log(req.session.username);
	if (!req.session.username) {
		res.redirect('/login.html'); 
	} else {
		// Give them the main page
  		//res.send('session user-id: ' + req.session.userid + '. ');
		res.send(req.session);
	}
});
app.post('/register', function(req, res) {
	// We want to "hash" the password so that it isn't stored in clear text in the database
	var passwordHash = generateHash(req.body.password);

	// The information we want to store
	var registration = {
		"username": req.body.username,
		"password": passwordHash
	};
	// Insert into the database
	db.insert(registration);
	console.log("inserted " + registration);	
	// Give the user an option of what to do next
	res.send("Registered Sign In" );	
});	
// Post from login page
app.post('/login', function(req, res) {
	// Check username and password in database
	db.findOne({"username": req.body.username},
		function(err, doc) {
			if (doc != null) {
				// Found user, check password				
				if (compareHash(req.body.password, doc.password)) {				
					// Set the session variable
					req.session.username = doc.username;
					// Put some other data in there
					req.session.lastlogin = Date.now();
					res.redirect('/');
				} else {
					res.send("Invalid Try again");
				}
			} 
		}
	);
});
app.get('/logout', function(req, res) {
	delete req.session.username;
	res.redirect('/');
});


app.post('/formdata', function(req,res) {
    var dataToSave = {
        time: Number(req.body.time.replace(/-/g,"")),
		timePost: req.body.time,
        location: req.body.location,
        content: req.body.content,
        length: req.body.content.length,
		date: Date.now(),
    };
    db2.insert(dataToSave,function(err,newDoc) {
        console.log(err);
        db2.find({}, function(err, docs) {
            console.log(err);
            console.log(dataToSave);
            var dataWrapper = {data: docs};
			console.log(dataWrapper);
            res.render("blog.ejs",dataWrapper);
        })
    }) 
});

app.get('/formdata', function(req,res) {
	db2.find({}, function(err, docs) {
	var dataWrapper = {data: docs};
	res.render("blog.ejs",dataWrapper);
})
});

httpsServer.listen(443);