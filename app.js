// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res){
   const firstName = req.body.fName;
   const lastName = req.body.lName;
   const email = req.body.email;

   console.log(firstName, lastName, email);
   const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields : {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  } ;

  const json_data = JSON.stringify(data);

const url = "https://us6.api.mailchimp.com/3.0/lists/c995e9844a";
  //the options required to send data to mailchimp server
  const options = {
    //these values are specified in the documentation
    method : "POST",
    //authorization , requires username(which could be any string) and password(api key)
    auth : "Saksham:093fe718dd5086225df89610e1ade798-us6" //the api key has been hidden due to security resons
  }

  //using above in our https request
   status = ""
  const request = https.request(url , options , function(response){

    // console.log(response);
    // console.log(response.statusCode);
    status = response.statusCode;
    response.on('data' , function(data){
      var t = JSON.parse(data);
      // console.log(t);
    })
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/sucess.html");

    }
    else{

      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(json_data);

  request.end();
  // console.log(status);

});

app.post("/failure", function(req, res){
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
})
// API Key
// 093fe718dd5086225df89610e1ade798-us6
// List_Id
//c995e9844a
// heroku link->  https://polar-wildwood-68828.herokuapp.com/
