//Express is a node module for building http servers
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedBodyParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedBodyParser);

//Tell express to look in the "public" directory for any files, first!
app.use(express.static("public"));

var submittedData = [];

//The default route of / and what to do
app.get("/", function(req,res) {
    res.send("<html><body><h1>Hello Thank you for connecting!</h1></body></html>");
});

app.post('/formdata', function(req,res) {
    var dataToSave = {
        color: req.body.color,
        size: req.body.size,
        name: req.body.name,
        text: req.body.data,
    };

    console.log(dataToSave);

    submittedData.push(dataToSave);
    
    console.log(submittedData);
    
    var output = "<html><body>";
    output += "<h1>You Shared:<h1/>";
    for (var i =0; i < submittedData.length; i++) {
        output += "<div style='color: " + submittedData[i].color + "; font-size: " + submittedData[i].size +"'>" + submittedData[i].name + "<br>" + submittedData[i].text + "</div>";
    }
    output += "</body></html>";
    res.send(output);
});

app.listen(80);
