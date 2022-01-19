require("dotenv").config();
const moment = require("moment");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { authLogin } = require("./utils/auth");

const express = require("express"),
  app = express(),
  exphbs = require("express-handlebars");
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./public/views");

var paginateHelper = require("express-handlebars-paginate");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: "true",
  })
);

app.use(cookieParser());

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
    next();
});

app.use(express.static(__dirname + "/public"));

app.use("/patient", require("./controllers/patient.C"));

app.use("/address", require("./controllers/address.C"));

app.use("/product", require("./controllers/product.C"));

app.use("/product-package", require("./controllers/product-package.C"));

app.use("/admin", require("./controllers/admin.C"));

app.use("/statistic", require("./controllers/statistic.C"));

app.use("/payment", require("./controllers/payment.C"));

app.use("/account", require("./controllers/account.C"));

app.get("/", authLogin, (req, res) => {
  res.render("home", {});
});

hbs.handlebars.registerHelper("paginateHelper", paginateHelper.createPagination);
hbs.handlebars.registerHelper("cond", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
});

hbs.handlebars.registerHelper("formatMoney", function (value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
});

const DateFormats = {
  short: "DD MMMM - YYYY",
  long: "dddd DD-MM-YYYY HH:mm",
};

hbs.handlebars.registerHelper("formatDate", function (datetime, format) {
  if (moment) {
    // can use other formats like 'lll' too
    format = DateFormats[format] || format;
    return moment(datetime).format(format);
  } else {
    return datetime;
  }
});

app.listen(process.env.PORT);
