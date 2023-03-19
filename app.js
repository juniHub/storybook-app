const mongoSanitize = require('express-mongo-sanitize');

const path = require( 'path' );
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require( 'express-session' );
const flash = require( 'connect-flash' );
const MongoStore = require( 'connect-mongo' );


const connectDB = require('./config/db');


if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: './config/config.env' });
}


//passport config
require('./config/passport')(passport);

//connectDB();

const app = express();


//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(mongoSanitize({
    replaceWith: '_'
}))


//handlebars helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
  condition,
 
} = require('./helpers/hbs');

//handlebars
app.engine(
  '.hbs',
  exphbs.engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
      condition,
     
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set( 'view engine', '.hbs' );

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//sessions
app.use(
  session( {
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
   
  })
);

app.use( flash() );


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global var
app.use( (req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



//Routes


app.use( '/', require( './routes/index' ) );

app.use('/auth', require('./routes/auth'));
app.use( '/stories', require( './routes/stories' ) );




const port = process.env.PORT || 3000;


//Connect to the database before listening
connectDB().then(() => {
  app.listen(port, () => {
      console.log(`Server running on port ${ port }`);
  })
})
