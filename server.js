const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const shortUrl = require("./models/shortUrl");
require("dotenv").config();
const validateURL = require("./libraries/regex-weburl.js");
const uuidv4 = require("uuid/v4");


// server.use(express.json());

// CORS - OPTIONS, to fix "No 'Access-Control-Allow-Origin' header" issue
const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

server.use(cors(corsOptions));

// Connect to database:
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
).then(() => console.log('\n===connected to mongo===\n'))
.catch(err =>console.log('not connected'))

// Allows node to find static content e.g. index.html
// server.use(express.static(__dirname + "/public"));

// Creates the database entry
// note*: The parens with asterisk is necessary - avoids issue of interp as folder directory
server.get("/new/:urlToShorten(*)", (req, res, next) => {
  var urlToShorten = req.params.urlToShorten;
  if (validateURL.test(urlToShorten)) {
    const randStr = uuidv4() + ""
    const short = randStr.slice(0,10)
    let data = new shortUrl(
      {
        originalUrl: urlToShorten,
        shortUrl: short
      }
    )
    data.save(err=>{
      if(err){
        res.json("There was an error while saving data")
      }
    })
    res.json(data);
  } else {
    let data = new shortUrl(
      {
        originalUrl: urlToShorten,
        shortUrl: "shortURL not created -- URL Invalid"
      })
    res.json(data)
  }
});

server.get('/', (req, res)=>{
  res.send({api: "shortURL server up and running"})
})

// Query database and forward to originalURL:
server.get('/:urlToForward', (req,res,next)=>{
  // store value of urlToForward
var shorterUrl = req.params.urlToForward;
shortUrl.findOne({'shortUrl': shorterUrl}, (err, data)=>{
  if(err){
    res.send('Error reading database');
  } else {
    res.redirect(301, data.originalUrl)
  }

})
})

// Listen to see if everything is working
server.listen(process.env.PORT || 5000, () => {
  
});
