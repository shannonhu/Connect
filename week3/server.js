//Express is a node module for building http servers
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true});

var urlencodedBodyParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedBodyParser);

app.set('view engine', 'ejs');

//Tell express to look in the "public" directory for any files, first!
app.use(express.static("views"));

var submittedData = [];

//The default route of / and what to do
app.get('/', function(req,res) {
    //get data from db
    //wrap it in a object
    res.render("outputtemplate.ejs", {});
});

app.get('/search', function(req,res) {
    var query = new RegExp(req.query.q, 'i');
    db.find({text:query}, function(err,docs) {
        var dataWrapper = {data:docs};
        res.render("outputtemplate.ejs", dataWrapper);
    })
});

// app.get('/displayrecord', function(req,res) {
//     db.find({_id: req.query._id}, function(err, docs) {
//         var dataWrapper = {data: docs[0]};
//         res.render("individual.ejs", dataWrapper);
//     });
// });

app.post('/formdata', function(req,res) {
    var dataToSave = {
        color: req.body.color,
        size: req.body.size,
        name: req.body.name,
        text: req.body.data,
    };

    db.insert(dataToSave,function(err,newDoc) {
        //res.send("Data Saved: " + newDoc);
        //Callback is optional
        //newDoc is the newly inserted document, including its id
        //newDoc has no key called notToBeSaved since its value was undefined
        db.find({}, function(err, docs) {
            var dataWrapper = {data: docs};
            res.render("outputtemplate.ejs",dataWrapper);
        })
    }) 
    //res.redirect("/");
});




app.listen(80);
