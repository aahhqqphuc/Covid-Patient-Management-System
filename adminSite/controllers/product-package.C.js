const express = require("express");
const router = express.Router();
const model = require("../models/product-package.M");
module.exports = router;
router.get("/", async (req, res) => {
  const page = +req.query.page || 1;
  const pagesize = +req.query.pagesize || 5;
  const result = await model.getAll(page, pagesize);
  res.render("product-package/product-packageList", {
    layout: "managerLayout",
    packages: result.data,
    pagination: { page: parseInt(page), limit: pagesize, totalRows: result.total },
  });
});
router.get("/filter", async (req, res) => {
  const page = +req.query.page || 1;
  const period = req.query.period || -1;
  const pagesize = +req.query.pagesize || 5;
  const search = req.query.search || "";
  const sortby = req.query.sortby || "id_goi_nhu_yeu_pham";
  const asc = req.query.asc;
  const result = await model.filter(period, sortby, asc, search, page, pagesize);
  res.render("product-package/product-packageList", {
    layout: "managerLayout",
    packages: result.data,
    search: search,
    period: period,
    sortby: sortby,
    asc: asc,
    pagination: { page: parseInt(page), limit: pagesize, totalRows: result.total, queryParams: { period: period } },
  });
});
router.get("/detail/:id", async (req, res) => {
  let id = req.params.id;
  let data = await model.getById(id);
  console.log(data);
  res.render("product-package/product-packageDetail", {
    layout: "managerLayout",
    package: data.package[0],
    products: data.products,
  });
});
router.get("/add", async (req, res) => {
  let pros = await model.getAllProducts();
  res.render("product-package/product-packageNew", { layout: "managerLayout", products: pros });
});
router.post("/add", async (req, res) => {
  let pros = await model.getAllProducts();
  console.log("body", req.body);
  if (req.body.pre_add == "true") {
    let arr = req.body.products_selected ? req.body.products_selected.toString() : "";
    var products_selected = arr.length > 1 ? await model.getProducts(arr) : [];
    return res.render("product-package/product-packageNew", {
      layout: "managerLayout",
      ten_goi: req.body.ten_goi,
      thoi_gian: req.body.thoi_gian,
      muc_gioi_han: req.body.muc_gioi_han,
      products_selected: products_selected,
      products: pros,
      error: arr.length <= 1,
    });
  } else if (req.body.main == "true") {
    return res.render("product-package/product-packageNew", { layout: "managerLayout", products: pros });
  }
  console.log("error");
  return res.render("product-package/product-packageNew", { layout: "managerLayout", products: pros });
});

// API for puchase
const db = require("../models/db");

router.get("/package-detail/:id", async (req, res) => {
  try {
      const result = await model.getPackageProducts(req.params.id);
      console.log(result);
      const data = {
          'info': result.package,
          'products': result.packageProducts
      }
      res.json(data);
  } catch (error) {
      res.status(404, error.message);
  }
});

