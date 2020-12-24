const express = require("express");
const mongoose = require("mongoose");
const { Order, validate } = require("../model/order");
const { Product } = require("../model/product");
const { Customer } = require("../model/customer");
const Customerauth = require("../middleware/customerAuth");
const Joi = require("joi");
mongoose.set("useFindAndModify", false);

const router = express.Router();

router.get("/", Customerauth, async (req, res) => {
  let result = await Order.find()
    .populate("products", "name price -_id")
    .populate("customer", "name mobile email -_id");

  res.send(result);
});
router.get("/:id", async (req, res) => {
  let findOrder = await Order.findById(req.params.id)
    .populate("products", "name price -_id")
    .populate("customer", "name mobile email -_id");
  if (!findOrder) {
    res.status(404).send("invalid Order Id");
    return;
  }
  res.send(findOrder);
});

router.post("/", Customerauth, async (req, res) => {
  let total = 0;
  let orderedProducts = [];
  let quantities = [];

  let valid = validate(req.body);
  if (valid.error) {
    res.status(400).send(valid.error.details[0].message);
    return;
  }
  let cartProducts = req.body.products;

  for (let i = 0; i < cartProducts.length; i++) {
    const product = cartProducts[i];
    const quantity = product.quantity;
    let existedProduct = await Product.findById(product._id);

    if (existedProduct) {
      orderedProducts.push(existedProduct);
      quantities.push(product.quantity);
      total += existedProduct.price * quantity;
    }
  }

  let customer = await Customer.findById(req.authUser._id);

  if (!customer) {
    res.status(404).send("invalid customer Id");
    return;
  }

  const order = new Order({
    products: orderedProducts,
    quantity: quantities,
    customer: customer,
    receivedName: req.body.receivedName,
    receivedMobileNo: req.body.receivedMobileNo,
    receivedAddress: req.body.receivedAddress,
    total: total,
  });
  let result = await order.save();
  res.send(result);

  //let p = await Promise.all(list.map(_id => Product.findById(_id)));
});

router.delete("/:id", async (req, res) => {
  let order = await Order.findOneAndRemove(req.params.id);

  if (!order) {
    res.status(404).send("not found");
    return;
  }
  res.send(order);
});

module.exports = router;
