// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Promise = require("bluebird");
mongoose.Promise = Promise;

// Require History Schema
// var History = require("./models/History");

// Require History Schema
var shoes = require("./models/shoes");
var newReleases = require("./models/newReleases");

// Create Instance of Express
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.text());
//app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("./public"));

// ----------------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)

mongoose.connect("mongodb://heroku_x64zbff1:v3srgq0jpnp9aiq12m477grpla@ds139979.mlab.com:39979/heroku_x64zbff1");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// -----------------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// This is the route we will send GET requests to retrieve our most recent search data.
// We will call this route the moment our page gets rendered
/*app.get("/api", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  History.find({}).sort([
    ["date", "descending"]
  ]).limit(5).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});*/

app.get("/models", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  shoes.find({}).sort([
    ["date", "descending"]
  ]).limit(15).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});


app.get("/api/newReleases", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
 newReleases.find({}).sort({releaseDate: +1}).exec(function(err, doc){
  if(err){
    console.log(err);
  }
  else
    res.send(doc);
});
});


/*
app.get("/allshoes", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  shoes.find({}, function(err, allshoes){
    if(err)
      console.log(err)
    else{
      console.log(allshoes);
      res.send(doc);
    }
  });
});
*/

// This is the route we will send POST requests to save each search.
/*app.post("/api", function(req, res) {
  console.log("BODY: " + req.body.location);

  // Here we'll save the location based on the JSON input.
  // We'll use Date.now() to always get the current date time
  History.create({
    location: req.body.location,
    date: Date.now()
  }, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send("Saved Search");
    }
  });
});*/

app.post("/models", function(req, res) {
  //console.log("BODY: " + req.body.location);
  console.log(req.body);
  // Here we'll save the location based on the JSON input.
  // We'll use Date.now() to always get the current date time
  shoes.create({
    brand: req.body.brand,
    year: req.body.year,
    model: req.body.model,
    color: req.body.color,
    size: req.body.size,
    condition: req.body.condition,
    imageURL: req.body.imageURL,
    cardImageURL: req.body.transformURL,
    comments: req.body.comments,
    sellingPrice: req.body.sellingPrice,
    zipCode: req.body.zipCode

  })
  res.send("posted");
});

app.get("/models/:brand", function(req, res) {
  if(req.params.brand) {
    shoes.find({"brand":req.params.brand}, function (err,docs) { console.log(docs); res.json(docs); });
  }
  else{
    db.user.find(function (err, docs) { console.log(docs); res.json(docs); });
  }



});

app.get("/models/brand/getAll", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  shoes.find({}).distinct("brand",
    function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});





//----------------------------------------------------------------------------------------
// Any non API GET routes will be directed to our React App and handled by React Router

app.get("*", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});



// -------------------------------------------------

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
