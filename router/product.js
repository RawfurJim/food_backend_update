const express = require("express");
const mongoose = require("mongoose");

const { Product, validate, upload } = require("../model/product");
const { Category } = require("../model/category");

const multer = require("multer");
const router = express.Router();

router.get("/", async (req, res) => {
  let result = await Product.find().populate("category");
  res.send(result);
});

router.post("/", upload.single("productImage"), async (req, res) => {
  try {
    let valid = await validate(req.body);
    if (valid.error) {
      res.status(400).send(valid.error.details[0].message);
      return;
    }
  } catch (err) {
    console.log(err);
  }

  let categorym = await Category.findById(req.body.category);
  if (!categorym) {
    res.status(400).send("invalid category ID");
    return;
  }
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    productImage: "http://localhost:3002/uploads/" + req.file.filename,
  });
  let result = await product.save();
  console.log(req.file);
  res.send(result);
});

router.put("/:id", upload.single("productImage"), async (req, res) => {
  let v = validate(req.body);
  if (v.error) {
    res.status(400).send(v.error.details[0].message);
    return;
  }

  let categorym = await Category.findById(req.body.category);
  if (!categorym) {
    res.status(404).send("invalid id");
    return;
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
      category: req.body.category,
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.delete("/:id", async (req, res) => {
  let product = await Product.findByIdAndRemove(req.params.id);

  if (!product) {
    res.status(404).send("not found");
    return;
  }
  res.send(product);
});

module.exports = router;
