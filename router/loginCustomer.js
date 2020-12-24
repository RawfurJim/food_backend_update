const { Customer, validate } = require("../model/customer");
const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();

router.post("/", async (req, res) => {
  let valid = validationLogCustomer(req.body);
  if (valid.error) {
    res.status(400).send(valid.error.details[0].message);
    return;
  }
  let findCustomer = await Customer.findOne({ email: req.body.email });
  if (!findCustomer) {
    res.status(400).send("Invalid Email OR Password");
    return;
  }

  const CvalidPassword = await bcrypt.compare(
    req.body.password,
    findCustomer.password
  );

  if (!CvalidPassword) {
    res.status(404).send("Invalid Email Or Password");
    return;
  }

  const CustomerToken = findCustomer.getAuthToken();

  res.send(CustomerToken);
});

function validationLogCustomer(value) {
  const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });
  const result = schema.validate(value);
  return result;
}

module.exports = router;
