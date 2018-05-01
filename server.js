var express = require('express');
var app = express();
var path = require('path');
var bp = require('body-parser');
var port = 8000;
var session = require('express-session');
var dateFormat = require('dateformat');

app.use(express.static(path.join(__dirname, "/client/dist")));
app.use(bp.json());
app.use(session({secret:"Happytimes"}));

require("./server/config/mongoose.js");
require("./server/config/routes.js")(app)

app.listen(port, function(){
    console.log("listening at port", port);
})