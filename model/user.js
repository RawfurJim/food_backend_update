const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.getAuthToken = function () {
  const Utoken = jwt.sign(
    { _id: this._id, admin: this.admin },
    config.get("UserjwtPrivatekey")
  );
  return Utoken;
};

const User = mongoose.model("user", userSchema);

function validationUser(value) {
  const schema = Joi.object({
    name: Joi.string()

      .min(3)
      .max(30)
      .required(),

    password: Joi.string().required(),

    mobile: Joi.string().min(11).max(11).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    admin: Joi.boolean(),
  });
  const result = schema.validate(value);
  return result;
}

exports.User = User;
exports.validate = validationUser;
