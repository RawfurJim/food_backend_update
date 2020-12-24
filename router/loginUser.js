const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User, validate } = require("../model/user");
const config = require("config");

const router = express.Router();

router.post("/", async (req, res) => {
  let valid = validationUserLogin(req.body);
  if (valid.error) {
    res.status(400).send(valid.error.details[0].message);
  }

  let logUser = await User.findOne({ email: req.body.email });

  if (!logUser) {
    res.status(400).send("Invalid Email Or Password");
    return;
  }
  let validPass = await bcrypt.compare(req.body.password, logUser.password);
  if (!validPass) {
    res.status(400).send("Invalid Email Or Password");
    return;
  }
  const UserToken = logUser.getAuthToken();

  res.header("user-auth-token", UserToken).send("successfully Login");
});

function validationUserLogin(value) {
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
