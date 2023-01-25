// **Importing application dependencies
// **These are the dependencies which you had installed in your application. To use them, you can import them using the require keyword, as shown below:

// Require application dependencies
// These are express, body-parser, and request

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

// Configure dotenv package
require("dotenv").config();



// **Set up your API KEY, express app, and body-parser configurations, and your JavaScript template view engine.
// Set up your OpenWeatherMap API_KEY

const apiKey = `${process.env.API_KEY}`;

// Setup your express app and body-parser configurations
// Setup your javascript template view engine
// we will serve your static pages from the public directory, it will act as your root directory
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");




// **Next, you will setup your default display on launch. This is essentially the page the user will see when they run a get request to the / route.
// Setup your default display on launch
app.get("/", function (req, res) {
  // It will not fetch and display any data in the index page
  res.render("index", { weather: null, error: null });
});





// **Next, setup the post request display. This is the page that shows when you make a post request to the API with the data you want. Your fetch will happen on page load at the / endpoint.
// **Here, you shall use the city passed in the post request and API_KEY in your .env file to get the data from the API.

// On a post request, the app shall data from OpenWeatherMap using the given arguments
app.post('/', function(req, res) {


    // Get city name passed in the form
    let city = req.body.city;

    // Use that city name to fetch data
    // Use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;


    // **Next, we will request the data from the OpenWeatherMap API using the credentials passed in the URL. The data found in the body section will be stored in local variables then rendered on the webpage.
    // In case of errors, it will display an error message as shown bellow:

    // Request for data using the URL
    request(url, function(err, response, body) {

        // On return, check the json data fetched
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } 
        else {
            let weather = JSON.parse(body);

            //**Next, you will check if your weather data returned is undefined. This will indicate errors. If not, you will proceed to store the content.
            // you shall output it in the console just to make sure that the data being displayed is what you want
            console.log(weather);

            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } 
            else {
                // we shall use the data got to set up your output
                let place = `${weather.name}, ${weather.sys.country}`,
                  /* you shall calculate the current timezone using the data fetched*/
                  weatherTimezone = `${new Date(
                    weather.dt * 1000 - weather.timezone * 1000
                  )}`;
                let weatherTemp = `${weather.main.temp}`,
                  weatherPressure = `${weather.main.pressure}`,
                  /* you will fetch the weather icon and its size using the icon data*/
                  weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                  weatherDescription = `${weather.weather[0].description}`,
                  humidity = `${weather.main.humidity}`,
                  clouds = `${weather.clouds.all}`,
                  visibility = `${weather.visibility}`,
                  main = `${weather.weather[0].main}`,
                  weatherFahrenheit;
                weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

                // you shall also round off the value of the degrees fahrenheit calculated into two decimal places
                function roundToTwo(num) {
                  return +(Math.round(num + "e+2") + "e-2");
                }
                weatherFahrenheit = roundToTwo(weatherFahrenheit);


                //**Next, the stored values will now be rendered onto the webpage to generate a static webpage which will be displayed to the user.
                // you shall now render the data to your page (index.ejs) before displaying it out
                res.render("index", {
                  weather: weather,
                  place: place,
                  temp: weatherTemp,
                  pressure: weatherPressure,
                  icon: weatherIcon,
                  description: weatherDescription,
                  timezone: weatherTimezone,
                  humidity: humidity,
                  fahrenheit: weatherFahrenheit,
                  clouds: clouds,
                  visibility: visibility,
                  main: main,
                  error: null,
                });
              }
            }
        
    });



});




// you will set up your port configurations. You will also start the server and add a message to display when running.
app.listen(5000, function () {
    console.log("Weather app listening on port 5000!");
  });