const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Customer, validate } = require("../model/customer");
const Customerauth = require("../middleware/customerAuth");
const Userauth = require("../middleware/userAuth");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
  let result = await Customer.find();
  res.send(result);
});

router.get("/:id", Customerauth, async (req, res) => {
  let checkCustomer = await Customer.findById(req.params.id);
  if (!checkCustomer) {
    res.status(404).send("Invalid Customer Id");
    return;
  }
  res.send(checkCustomer);
});

router.post("/", async (req, res) => {
  let valid = await validate(req.body);
  if (valid.error) {
    res.status(400).send(valid.error.details[0].message);
    return;
  }
  let checkEmail = await Customer.findOne({ email: req.body.email });
  if (checkEmail) {
    res.status(400).send("email already exist");
    return;
  }
  const customer = new Customer({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
  });

  const salt = await bcrypt.genSalt(10);
  customer.password = await bcrypt.hash(customer.password, salt);

  let result = await customer.save();
  const token = customer.getAuthToken();

  res
    .header("customer-auth-token", token)
    .header("access-control-expose-headers", "customer-auth-token")
    .send(result);
});

router.put("/:id", Customerauth, async (req, res) => {
  let checkCustomer = await Customer.findById(req.params.id);
  if (!checkCustomer) {
    res.status(404).send("invalid customer id");
    return;
  }
  let valid = validate(req.body);
  if (valid.error) {
    res.status(400).send(valid.error.details[0].message);
    return;
  }
  (checkCustomer.name = req.body.name),
    (checkCustomer.email = req.body.email),
    (checkCustomer.password = req.body.password),
    (checkCustomer.mobile = req.body.mobile);
  const salt = await bcrypt.genSalt(10);
  checkCustomer.password = await bcrypt.hash(checkCustomer.password, salt);

  let result = await checkCustomer.save();
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  let deleteCustomer = await Customer.findByIdAndRemove(req.params.id);

  if (!deleteCustomer) {
    res.status(404).send("invalid id");
    return;
  }
  res.send(deleteCustomer);
});

module.exports = router;
