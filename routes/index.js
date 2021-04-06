const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require( "../middleware/auth" );

//request quote api
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
        quote: null,
        author: null,
      });
    } else {
      res.render("login", {
        layout: "login",
        stories,
        quote: quoteData.quotes[index].quote,
        author: quoteData.quotes[index].author,
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
});

module.exports = router;
