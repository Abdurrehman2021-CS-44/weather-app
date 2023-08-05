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

app.post("/", function(req, res){
    const cityName = req.body.city;
    const apiKey = "b64d8c946a1cf7381032ac0de8648349";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=" + units;
    https.get(url, function(response){
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            if (weatherData.message){
                res.render("response", {
                    responseTitle: "OOPS! 🕸",
                    responseDisc: weatherData.message,
                    responseSuggestion: "Try another city"
                });
            } else {
                const weatherIcon = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png"
                const cityName = weatherData.name;
                const temperature = Math.round(weatherData.main.temp);
                const feelsLike = Math.round(weatherData.main.feels_like);
                const humidity = weatherData.main.humidity;
                const description = weatherData.weather[0].description;
                res.render("resultPage", {
                    weatherImage: weatherIcon,
                    temperature: temperature,
                    desc: description,
                    location: cityName,
                    feelsLike: feelsLike,
                    humidity: humidity
                })
            }
        });
    });
});

app.listen(3000, function(){
    console.log("Server is running on 3000 port");
});