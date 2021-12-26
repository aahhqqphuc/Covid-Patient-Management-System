const express = require("express"),
  app = express(),
  port = 3001,
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
// app.use("/order", require("./controllers/home.C"));
// app.use("/", (req, res) => {
//   res.redirect("/order");
// });
app.get("/", (req, res) => {
  res.render("home", {});
});
app.listen(port);
