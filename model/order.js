const mongoose = require("mongoose");
const Joi = require("joi");
const { Product } = require("./product");
const { Customer } = require("./customer");
Joi.objectId = require("joi-objectid")(Joi);

const orderSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  quantity: {
    type: [Number],
    default: 1,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  receivedName: { type: String, required: true },
  receivedMobileNo: { type: String, required: true },
  receivedAddress: { type: String, required: true },
  total: {
    type: Number,
  },
});

const Order = mongoose.model("order", orderSchema);

function validationOrder(value) {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          quantity: Joi.number().required(),
          _id: Joi.objectId().required(),
        })
      )
      .required(),
    receivedName: Joi.string().required(),
    receivedMobileNo: Joi.string().required(),
    receivedAddress: Joi.string().required(),
  });
  const result = schema.validate(value);
  return result;
}

exports.Order = Order;
exports.validate = validationOrder;
