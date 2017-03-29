var express = require("express");
var mongodb_1 = require("mongodb");
var app = express();
var router = express.Router();
var path = __dirname + '/views/' ;
var mongolocation = "mongodb://ubuntu@ec2-54-200-174-183.us-west-2.compute.amazonaws.com/userDetails" ;
var collectionName = "details" ;

  var databaseConnection = null ;
  var reportCollection = null ;

mongodb_1.MongoClient.connect(mongolocation, function(err, db) {
  if(!err) {
    console.log("connected to MongoServer");
    reportCollection = db.collection(collectionName);
  }
  else
  console.log("error connecting to Mongo -- >> "+err) ;
});


router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "home.html");
});

router.get("/profile",function(req,res){
    res.sendFile(path + "profile.html");
});

router.get("/userdata",function(req,res){
    var doc = { "user" : req.query.user };
    console.log( req.query ) ;
    reportCollection.insert(doc) ;
    res.send("200") ;
});

router.get("/userStats",function(req,res){

var count ;
reportCollection.find({"user":req.query.user}, function(err, cursor){
    cursor.toArray(function (err, data) {
    console.log("data -- >> "+data.length) ;
    res.send(data.length.toString()) ;            
});
  }); 
  });

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});