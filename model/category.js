const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("category", categorySchema);

function validationCategory(value) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });
  const result = schema.validate(value);
  return result;
}

exports.Category = Category;
exports.validate = validationCategory;
