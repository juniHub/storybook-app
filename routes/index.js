const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require( "../middleware/auth" );


//request quote API
const request = require("request");

const Story = require("../models/Story");

const quoteUrl =
  "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";


getRandomIndex = (quotes) => {
  if (quotes.length > 0) {
    const index = Math.floor(Math.random() * quotes.length);
    return index;
  }
};


//request weather API
const apiKey = process.env.WEATHER_KEY;

const today = new Date();

convertToF= (celsius) => {
  return celsius * 9/5 + 32
}


// @desc    Login/Landing page
// @route   GET /
router.get( "/", ensureGuest, async ( req, res ) =>
{
  
  const stories = await Story.find({ status: 'public' })
      .sort({ createdAt: 'desc' })
      .lean();

  request( quoteUrl, ( err, response, body ) =>
  {
   
    const quoteData = JSON.parse(body);
    const index = getRandomIndex( quoteData.quotes ); 

    if (err) {
      res.render("login", {
        layout: "login",
        stories,
        quote: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington",
        weather: null, temp: null, tempF:null, icon: "/assets/weather.svg", today, error: null
      });
    } else {
      res.render("login", {
        layout: "login",
        stories,
        quote: quoteData.quotes[index].quote,
        author: quoteData.quotes[ index ].author,
        weather: null, temp: null, tempF:null, icon: "/assets/weather.svg", today, error: null
      });
    }
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
} );

router.post( '/',  ensureGuest, async ( req, res ) =>
{
  const city = req.body.cityName || geoCity;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ city }&units=metric&appid=${ apiKey }`;
   const stories = await Story.find({ status: 'public' })
      .sort({ createdAt: 'desc' })
      .lean();

  request( url,  ( err, response, body )=>
  {


    const weather = JSON.parse( body );

    if ( err )
    {
      res.render( "login", {
        layout: "login",
        stories,
        quote: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington",
       
        weather: null, temp: null, tempF: null, icon: "/assets/weather.svg", today,  error: 'Enter city name!'
      } );

           
    } else
    {


      if ( weather.main === undefined )
      {
        res.render( "login", {
          layout: "login",
          stories,
          quote: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington",
          
          weather: null, temp: null, tempF: null, icon: "/assets/weather.svg", today, error: 'Enter city name!'
        } );

      } else
      {
        const weatherText = `It's ${ weather.weather[ 0 ].description } in ${ weather.name }, ${weather.sys.country} now!`;

        const mainWeather = weather.weather[ 0 ].main;

        const temperature = Math.floor(weather.main.temp);

        const Fdegrees = convertToF( temperature );
        
        const defaultIcon = weather.weather[ 0 ].icon;

        const iconPath = `/assets/${ mainWeather }.svg`
        const weatherIcon = iconPath 
        if ( iconPath == null || iconPath == undefined )
        {
           weatherIcon = "https://openweathermap.org/img/wn/" + defaultIcon + "@2x.png";
        }


        res.render( "login", {
          layout: "login",
          stories,
          quote: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington",
         
          weather: weatherText, temp: temperature, tempF: Fdegrees, icon: weatherIcon, today, error:null
        } );
      }
    }
  } );
} );

module.exports = router;
