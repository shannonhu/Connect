//Express is a node module for building http servers
var express = require('express');
var app = express();

var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true});

//Tell express to look in the "public" directory for any files, first!
app.use(express.static("public"));

app.get('/formdata', function(req,res) {
    var dataToSave = {
        color: req.query.color,
        title: req.query.title,
        text: req.query.text,
    };

    db.insert(dataToSave,function(err,newDoc) {
        db.find({}, function(err, docs) {
            // var dataWrapper = {data: docs};
            // res.render("outputtemplate.ejs",dataWrapper);

            //take a js object and send it back to the browser
            res.send(docs);
        })
    }) 
});

app.listen(80);
