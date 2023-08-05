const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.get("/", function(req, res){
    res.render("searchPage")
});

app.get("/result", function(req, res){
    res.render("resultPage")
});

app.post("/", function(req, res){
    const cityName = req.body.city;
    const apiKey = "b64d8c946a1cf7381032ac0de8648349";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=" + units;
    https.get(url, function(response){
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const weatherIcon = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png"
            const cityName = weatherData.name;
            const temperature = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            res.send("<h1>The temperature in " + cityName + " is " + temperature + " in celcius.</h1><p>The weather is currently " + description + ".</p><img src=" + weatherIcon + ">");
        });
    });
});

app.listen(3000, function(){
    console.log("Server is running on 3000 port");
});