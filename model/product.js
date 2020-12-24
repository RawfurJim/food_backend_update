const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const multer = require("multer");

const { Category } = require("./category");

Joi.objectId = require("joi-objectid")(Joi);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = function fileFilter(req, file, cb) {
  if (
    file.mimetype !== "image/png" &&
    file.mimetype !== "image/jpeg" &&
    file.mimetype !== "image/jpg"
  ) {
    return cb(new Error("only image are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("product", productSchema);

function validationProduct(value) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    category: Joi.objectId().required(),
    price: Joi.number().required(),
  });
  const result = schema.validate(value);
  return result;
}

exports.Product = Product;
exports.validate = validationProduct;
exports.upload = upload;
