const express = require("express");
const router = express.Router();
const productM = require("../models/product.M");
module.exports = router;
const upload = require("../middlewares/upload");
const manager = 1;

router.get("/", async (req, res) => {
  const page = +req.query.page || 1;
  const pagesize = +req.query.pagesize || 5;
  const result = await productM.getPaging(page, pagesize, manager);
  res.render("product/productList", {
    layout: "managerLayout",
    products: result.data,
    pagination: { page: parseInt(page), limit: pagesize, totalRows: result.total },
  });
});

router.get("/filter", async (req, res) => {
  const page = +req.query.page || 1;
  const priceFrom = +req.query.price || 0;
  const priceTo = priceFrom != 0 ? priceFrom + 100000 : 100000000;
  const pagesize = +req.query.pagesize || 5;
  const search = req.query.search || "";
  const sortby = req.query.sortby || "id_nhu_yeu_pham";
  const asc = req.query.asc;
  const result = await productM.filter(priceFrom, priceTo, sortby, asc, search, page, pagesize);
  res.render("product/productList", {
    layout: "managerLayout",
    products: result.data,
    search: search,
    price: priceFrom,
    sortby: sortby,
    asc: asc,
    pagination: {
      page: parseInt(page),
      limit: pagesize,
      totalRows: result.total,
      queryParams: { price: priceFrom, search: search, sortby: sortby, asc: asc },
    },
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
    mo_ta: data.mo_ta,
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
router.post("/edit/:id", upload.array("ImagePath"), async (req, res) => {
  let data = req.body;
  let id = req.params.id;
  var product = {
    id_nhu_yeu_pham: id,
    ten_sanpham: data.ten_sanpham,
    gia_tien: data.gia_tien,
    con_lai: +data.con_lai || 0,
    mo_ta: data.mo_ta,
  };
  const rs = await productM.edit(product);
  if (rs) {
    req.files.forEach(async (item) => {
      try {
        await productM.addImg({ id_nhu_yeu_pham: id, url: "/img/" + item.filename });
      } catch (error) {
        console.log("add pro error", error);
      }
    });
  }
  res.redirect("/product");
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  let data = await productM.getById(id);
  const rs = await productM.delete(id);
  if (rs) {
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

router.get("/image/delete/:id", async (req, res) => {
  const id = req.params.id;
  const img = await productM.deleteImg(id);
  if (img) {
    try {
      await fs.remove("public" + img[0].url);
    } catch (err) {
      console.error("delete image file error", err);
    }
  }
  res.redirect("/product/edit/" + img[0].id_nhu_yeu_pham);
});
