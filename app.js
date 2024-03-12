const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');




const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

const app = express();
const db = require('./config/connection');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials'
}));

app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());
// app.use(fileUpload())

db.connect((err) => {
  if (err) {
    console.error("Connection Error", err);
    process.exit(1);
  } else {
    console.log("Database Connected to port 27017");

    // Continue setting up Express and routes here
  }
});




app.use('/', userRouter);
app.use('/admin', adminRouter);

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