const express = require("express");
const router = express.Router();
const model = require("../models/product.M");
module.exports = router;
const upload = require("../middlewares/upload");
const fs = require("fs-extra");
router.get("/", async (req, res) => {
  const data = await model.all();
  res.render("Product/ProductList", {
    products: data,
    script: ["../Product/ProductList.js"],
  });
});
router.get("/add", async (req, res) => {
  res.render("product/newProduct", { script: ["../Product/upload.js"] });
});
router.get("/edit/:id", async (req, res) => {
  let id = req.params.id;
  let cats = await categoryM.all();
  let pro = await productM.get(id);
  res.render("product/editProduct", {
    cssP: () => "css",
    scriptsP: () => "scripts",
    footerP: () => "footer",
    categories: cats.filter((x) => x.CatID !== pro.CatID),
    product: pro,
    selectedCat: cats.find((x) => x.CatID === pro.CatID),
  });
});
router.post("/product/edit/:id", upload.single("ImagePath"), async (req, res) => {
  let product = req.body;
  product.ImagePath = "/img/" + req.file.filename;
  const rs = await productM.edit(product);
  res.redirect("/");
});
router.post("/product/add", upload.single("ImagePath"), async (req, res) => {
  let product = req.body;
  product.ImagePath = "/img/" + req.file.filename;
  const rs = await productM.add(product);
  res.redirect("/");
});
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await productM.delete(id);
  res.redirect("/");
});
