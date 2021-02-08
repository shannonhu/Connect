//Express is a node module for building http servers
var express = require('express');
var app = express();

//Tell express to look in the "public" directory for any files, first!
app.use(express.static("public"));

//The default route of / and what to do
app.get("/", function(req,res) {
    res.send("<html><body><h1>Hello Thank you for connecting!</h1></body></html>");
});

app.listen(80);
