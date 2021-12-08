
const express = require("express");
const https = require("https");

const app = express();
const port = 3000;
require("dotenv").config();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = process.env.TARGETURL;
  const options = {
    method: "POST",
    auth: process.env.APIKEY
  }
  const request = https.request(url, options, function(response){

    if (response.statusCode ===  200){
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });


  request.write(jsonData);
  request.end();

});

app.post("/home", function(req, res){
  res.redirect("/");
})


app.listen(process.env.PORT || port, function(){
  console.log("App is listening on port " + port);
});
