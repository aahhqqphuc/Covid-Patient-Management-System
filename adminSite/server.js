require("dotenv").config();

const express = require("express"),
  app = express(),
  exphbs = require("express-handlebars");
const hbs = exphbs.create({
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(
  express.urlencoded({
    extended: "true",
  })
);

app.use(express.static(__dirname + "/public"));

app.use("/patient", require("./controllers/patient.C"));

app.use("/address", require("./controllers/address.C"));

app.use("/product", require("./controllers/product.C"));

app.use("/admin", require("./controllers/admin.C"));

app.use("/statistic", require("./controllers/statistic.C"));

app.get("/", (req, res) => {
  res.render("home", {});
});

app.listen(process.env.PORT);
