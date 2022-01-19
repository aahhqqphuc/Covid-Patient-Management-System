require("dotenv").config();

const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");

const express = require("express"),
  app = express();

app.use(
  express.urlencoded({
    extended: "true",
  })
);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/payment", require("./controllers/payment.C"));

app.listen(process.env.PORT);
