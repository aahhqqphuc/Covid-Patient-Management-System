const express = require("express");
const router = express.Router();
const model = require("../models/product-package.M");
let products_selected = [];
const { isManager } = require("../utils/auth");

router.get("/", async (req, res) => {
  const role = req.user.role;
  const page = +req.query.page || 1;
  const pagesize = +req.query.pagesize || 8;
  const result = await model.getAll(page, pagesize, role);
  console.log(role == "manager" ? "managerLayout" : "patientLayout");
  res.render("product-package/product-packageList", {
    layout: role == "manager" ? "managerLayout" : "patientLayout",
    packages: result.data,
    pagination: { page: parseInt(page), limit: pagesize, totalRows: result.total },
    role: role,
  });
});

router.get("/filter", async (req, res) => {
  const role = req.user.role;
  const page = +req.query.page || 1;
  const period = req.query.period || -1;
  const pagesize = +req.query.pagesize || 8;
  const search = req.query.search || "";
  const sortby = req.query.sortby || "id_goi_nhu_yeu_pham";
  const asc = req.query.asc;
  const result = await model.filter(period, sortby, asc, search, page, pagesize, role);
  res.render("product-package/product-packageList", {
    layout: role == "manager" ? "managerLayout" : "patientLayout",
    packages: result.data,
    search: search,
    period: period,
    sortby: sortby,
    asc: asc,
    role: role,
    pagination: {
      page: parseInt(page),
      limit: pagesize,
      totalRows: result.total,
      queryParams: { search: search, period: period, sortby: sortby, asc: asc },
    },
  });
});

router.get("/detail/:id", async (req, res) => {
  const role = req.user.role;
  let id = req.params.id;
  console.log("id", id);
  let data = await model.getById(id);
  res.render("product-package/product-packageDetail", {
    layout: role == "manager" ? "managerLayout" : "patientLayout",
    package: data.package[0],
    products: data.products,
    role: role,
  });
});

router.get("/add", isManager, async (req, res) => {
  const role = req.user.role;
  let pros = await model.getElseProducts(0);
  res.render("product-package/product-packageNew", {
    role: role,
    layout: "managerLayout",
    products: pros,
  });
});

router.post("/add", isManager, async (req, res) => {
  let pros = await model.getElseProducts(0);
  if (req.body.pre_add == "true") {
    let arr = req.body.products_selected ? req.body.products_selected.toString() : "";
    products_selected = arr.length > 1 ? await model.getProducts(arr) : [];
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
    var newPackage = {
      ten_goi: req.body.ten_goi,
      thoi_gian: req.body.thoi_gian,
      muc_gioi_han: req.body.muc_gioi_han,
    };
    var gioi_han_san_pham = req.body.gioi_han;
    const rs = await model.add(newPackage);
    const newId = rs[0].id_goi_nhu_yeu_pham;
    for (let index = 0; index < products_selected.length; index++) {
      const element = products_selected[index];
      await model.addProduct(+newId, element.id_nhu_yeu_pham, gioi_han_san_pham[index]);
    }
    return res.redirect(`/product-package/detail/${newId}`);
  }
  return res.redirect(`/product-package`);
});

router.get("/edit/:id", isManager, async (req, res) => {
  let id = req.params.id;
  let data = await model.getById(id);
  let package = data.package[0];
  let pros = await model.getElseProducts(id);
  res.render("product-package/product-packageEdit", {
    layout: "managerLayout",
    id: package.id_goi_nhu_yeu_pham,
    ten_goi: package.ten_goi,
    thoi_gian: package.thoi_gian,
    muc_gioi_han: package.muc_gioi_han_goi,
    products_selected: data.products,
    products: pros,
    role: role,
  });
});

router.get("/delete-product/:id", isManager, async (req, res) => {
  let id = req.params.id;
  let result = await model.getPackageId(id);
  let packageId = result[0].id_goi;
  let data = await model.getById(packageId);
  let package = data.package[0];
  let pros = await model.getElseProducts(packageId);
  if (data.products.length <= 2)
    return res.render("product-package/product-packageEdit", {
      layout: "managerLayout",
      ten_goi: package.ten_goi,
      thoi_gian: package.thoi_gian,
      muc_gioi_han: package.muc_gioi_han_goi,
      products_selected: data.products,
      products: pros,
      error: true,
    });
  let rs = await model.deleteProduct(id);
  return res.redirect(`/product-package/edit/${packageId}`);
});

router.post("/edit/:id", isManager, async (req, res) => {
  let id = req.params.id;
  let pros = await model.getElseProducts(id);
  console.log("body", req.body);
  if (req.body.pre_add == "true") {
    products_selected = req.body.products_selected;
    for (let index = 0; index < products_selected.length; index++) {
      console.log(index);

      await model.addProduct(id, products_selected[index], 1);
    }
    return res.redirect(`/product-package/edit/${id}`);
  } else if (req.body.main == "true") {
    console.log("main");
    var package = {
      id_goi_nhu_yeu_pham: id,
      ten_goi: req.body.ten_goi,
      thoi_gian: req.body.thoi_gian,
      muc_gioi_han_goi: req.body.muc_gioi_han,
    };
    var gioi_han_san_pham = req.body.gioi_han;
    products = req.body.products;
    const rs = await model.edit(package);
    for (let index = 0; index < products.length; index++) {
      await model.editProduct(products[index], gioi_han_san_pham[index]);
    }
    return res.redirect(`/product-package/detail/${id}`);
  }
  return res.redirect(`/product-package/detail/${id}`);
});

router.get("/disable/:id", isManager, async (req, res) => {
  const id = req.params.id;
  const rs = await model.disable(id);
  res.redirect("/product-package/detail/" + id);
});

router.get("/enable/:id", async (req, res) => {
  const id = req.params.id;
  const rs = await model.enable(id);
  res.redirect("/product-package/detail/" + id);
});

// API for puchase
router.get("/package-detail/:id", async (req, res) => {
  try {
    if (!req.user?.patientId) {
      return res.status(501).json({ info: "Vui lòng đăng nhập" });
    }

    const checkPuchase = await models.checkPuchase(req.user.patientId, req.params.id);
    if (checkPuchase.length) {
      return res.status(501).json({ info: "Bạn đã mua gói này trước đó <br> Vui lòng chọn mua Gói nhu yếu phẩm khác" });
    }

    const result = await model.getPackageProducts(req.params.id);
    const data = {
      info: result.package,
      products: result.packageProducts,
    };
    res.json(data);
  } catch (error) {
    res.status(404, error.message);
  }
});

module.exports = router;
