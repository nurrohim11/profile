var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'nurrohim',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      expires: new Date(Date.now() + 60 * 10000), 
      maxAge: 60*10000
    }
  })
)

// set url in locals and variable other
app.use ((req, res, next) => {
  res.printJson = (status, message, response)=> {
    // Do whatever you want, you have access to req and res in this closure
    res.json({
      metadata: {
        status:status,
        message:message
      },
      response : response
    })
  }
  
  res.locals.nama = req.session.user != undefined ? req.session.user.nama : ''
  res.locals.url = req.originalUrl;
  res.locals.host = req.protocol + '://' + req.get('host')+'/';
  res.locals.protocol = req.protocol;
  res.locals.js = ''
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// location assets
app.use('/metronic',express.static(path.join(__dirname,'node_modules/metronic6')));

// router
app.use('/api', apiRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
