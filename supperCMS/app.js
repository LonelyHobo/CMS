var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var exphbs  = require('express-handlebars');
var helper = require('./routes/helper');
var app = express();
app.engine('.hbs', exphbs({
    layoutsDir: 'views',
    defaultLayout: 'layout',
    partialsDir: 'views/web',
    extname: '.hbs',
    helpers:helper.helper
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('cmsadmin', path.join(__dirname, 'views/cmsadmin'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  res.render('cmsadmin/error');
});

module.exports = app;
