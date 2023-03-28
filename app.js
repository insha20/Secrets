require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));  

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser : true, useUnifiedTopology: true})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema ({
    email: String,
    password : String
});



const User = new mongoose.model("User", userSchema); 


app.get("/", function(req, res){
    res.render("home");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.get("/register", function(req, res){
    res.render("register");
})


app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password : hash
        });
    
        newUser.save()
        .then(function(registered){
            res.render("secrets");
        })
        .catch(function(err){
            console.log(err);
        }) 
    });
});


app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username})
    .then(function(foundUser){
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                res.render("secrets");
        });
       }
    })
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
})