const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
customerSchema.methods.getAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    config.get("CustomerjwtPrivatekey")
  );
  return token;
};

const Customer = mongoose.model("customer", customerSchema);

function validationCustomer(value) {
  const schema = Joi.object({
    name: Joi.string()

      .min(3)
      .max(30)
      .required(),

    password: Joi.string().required(),

    mobile: Joi.string().min(11).max(11).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });
  const result = schema.validate(value);
  return result;
}

exports.Customer = Customer;
exports.validate = validationCustomer;
