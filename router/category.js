const express = require("express");
const { Category, validate } = require("../model/category");

const router = express.Router();

router.get("/", async (req, res) => {
  let value = await Category.find();

  res.send(value);
});

router.post("/", async (req, res) => {
  let valid = validate(req.body);
  if (valid.error) {
    res.status(400).send(valid.error.details[0].message);
    return;
  }
  const category = new Category({
    name: req.body.name,
  });
  let result = await category.save();
  res.send(result);
});
module.exports = router;
