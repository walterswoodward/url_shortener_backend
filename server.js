const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const shortUrl = require("./models/shortUrl");
const validateURL = require("./libraries/regex-weburl.js");

server.use(express.json());
server.use(cors());

// Connect to database:
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
)

server.get('/', (req, res)=>{
  res.json({api: "URL shortener server up and running"})
})

server.get("/new/:urlToShorten(*)", (req, res) => {
  const urlToShorten = req.params.urlToShorten;
  if (validateURL.test(urlToShorten)) {
    const short = Math.floor(Math.random()*100000)
    let data = new shortUrl(
      {
        originalUrl: urlToShorten,
        shortUrl: short
      }
    )
    data.save()
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



// Query database and forward to originalURL:
server.get('/:urlToForward', (req,res,done)=>{
  // store value of urlToForward
const shorterUrl = req.params.urlToForward;
shortUrl.findOne({'shortUrl': shorterUrl}, (err, data)=>{
  if(err){
    done(err);
    // This is what is causing the H13/H10 but not sure how to fix yet
  } else if (data){
    res.redirect(301, data.originalUrl)
  }

})
})


// Listen to see if everything is working
server.listen(process.env.PORT || 5000, function(){
  
});