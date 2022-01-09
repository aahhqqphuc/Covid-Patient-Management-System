const express = require("express");
const router = express.Router();
const productM = require("../models/product.M");
module.exports = router;
const upload = require("../middlewares/upload");
const fs = require("fs-extra");
router.get("/", async (req, res) => {
  const page = +req.query.page || 1;
  const pagesize = +req.query.pagesize || 5;
  const data = await productM.getPaging(page, pagesize);
  const total = await productM.count();
  console.log(total);
  res.render("product/productList", {
    layout: "managerLayout",
    products: data,
    pagination: { page: parseInt(page), limit: pagesize, totalRows: total },
  });
});
router.get("/search", async (req, res) => {
  const page = +req.query.page || 1;
  const search = req.query.search || "";
  const pagesize = +req.query.pagesize || 5;
  const data = await productM.search(search, page, pagesize);
  const total = await productM.countSearch(search);
  res.render("product/productList", {
    layout: "managerLayout",
    products: data,
    pagination: { page: parseInt(page), limit: pagesize, totalRows: total, queryParams: { search: search } },
  });
});
router.get("/filter", async (req, res) => {
  const page = +req.query.page || 1;
  const price = +req.query.price || 0;
  const pagesize = +req.query.pagesize || 5;
  const data = await productM.filter(price, page, pagesize);
  const total = await productM.countFilter(price);
  res.render("product/productList", {
    layout: "managerLayout",
    products: data,
    pagination: { page: parseInt(page), limit: pagesize, totalRows: total, queryParams: { price: price } },
  });
});

router.get("/add", async (req, res) => {
  res.render("product/newProduct", { script: ["../product/upload.js"], layout: "managerLayout" });
});
router.post("/add", upload.array("ImagePath"), async (req, res) => {
  let data = req.body;
  var product = {
    ten_sanpham: data.ten_sanpham,
    gia_tien: data.gia_tien,
    con_lai: data.con_lai,
  };
  const rs = await productM.add(product);
  const newId = rs[0].id_nhu_yeu_pham;
  if (rs) {
    req.files.forEach(async (item) => {
      try {
        await productM.addImg({ id_nhu_yeu_pham: newId, url: "/img/" + item.filename });
      } catch (error) {
        console.log("add pro error", error);
      }
    });
  }

  res.redirect("/product");
});
router.get("/detail/:id", async (req, res) => {
  let id = req.params.id;
  let data = await productM.getById(id);
  res.render("product/productdetail", {
    layout: "managerLayout",
    product: data.pro[0],
    images: data.images,
  });
});
router.get("/edit/:id", async (req, res) => {
  let id = req.params.id;
  let data = await productM.getById(id);
  res.render("product/editproduct", {
    layout: "managerLayout",
    product: data.pro[0],
    images: data.images,
  });
});
router.post("/edit/:id", async (req, res) => {
  let product = req.body;
  const rs = await productM.edit(product);
  res.redirect("/");
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  let data = await productM.getById(id);
  const rs = await productM.delete(id);
  if (1) {
    data.images.forEach(async (item) => {
      try {
        await fs.remove("public" + item.url);
      } catch (err) {
        console.error("delete image file error", err);
      }
    });
  }
  res.redirect("/product");
});
