const express = require("express");
const mongoose = require("mongoose");
const { User, validate } = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
  let result = await User.find();
  res.send(result);
});

router.get("/:id", async (req, res) => {
  let checkUser = await User.findById(req.params.id);
  if (!checkUser) {
    res.status(404).send("Invalid User Id");
    return;
  }
  res.send(checkUser);
});

router.post("/", async (req, res) => {
  const valid = validate(req.body);
  if (valid.error) {
    res.status(400).send(valid.error.details[0].message);
    return;
  }
  let findUser = await User.findOne({ email: req.body.email });
  if (findUser) {
    res.status(400).send("user already exixt");
    return;
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    admin: req.body.admin,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  let result = await user.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  let valid = validate(req.body);
  if (valid.error) {
    res.status(404).send(valid.error.details[0].message);
    return;
  }
  let findUser = await User.findById(req.params.id);
  if (!findUser) {
    res.status(404).send("Invalid UserId");
    return;
  }
  (findUser.name = req.body.name),
    (findUser.email = req.body.email),
    (findUser.password = req.body.password),
    (findUser.mobile = req.body.mobile);

  const salt = await bcrypt.genSalt(10);
  findUser.password = await bcrypt.hash(findUser.password, salt);

  let result = await findUser.save();
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  let deleteUser = await User.findByIdAndRemove(req.params.id);
  if (!deleteUser) {
    res.status(404).send("Invalid User Id");
    return;
  }
  res.send(deleteUser);
});

module.exports = router;
