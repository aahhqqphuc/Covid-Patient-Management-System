const express = require("express");
const router = express.Router();
const productM = require("../models/product.M");
module.exports = router;
const upload = require("../middlewares/upload");
const fs = require("fs-extra");
router.get("/", async (req, res) => {
  const page = +req.query.page || 1;
  const data = await productM.getPaging(page);
  const total = await productM.count();
  res.render("product/productList", {
    layout: "managerLayout",
    products: data,
    pagination: { page: parseInt(page), limit: 7, totalRows: total },
  });
});
router.get("/add", async (req, res) => {
  res.render("product/newProduct", { script: ["../product/upload.js"] });
});
router.get("/edit/:id", async (req, res) => {
  let id = req.params.id;
  let pro = await productM.getById(id);
  console.log(pro);
  res.render("product/editProduct", {
    product: pro,
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
