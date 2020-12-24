const express = require("express");
const pathCategory = require("./router/category");
const pathProduct = require("./router/product");
const pathCustomer = require("./router/customer");
const pathUser = require("./router/user");
const pathOrder = require("./router/order");
const pathLoginCustomer = require("./router/logincustomer");
const pathLoginUser = require("./router/loginuser");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
console.log(path.join(__dirname, "uploads"));
const app = express();
app.use(cors());
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/api/category", pathCategory);
app.use("/api/product", pathProduct);
app.use("/api/customer", pathCustomer);
app.use("/api/user", pathUser);
app.use("/api/order", pathOrder);

app.use("/api/logincustomer", pathLoginCustomer);
app.use("/api/loginuser", pathLoginUser);

mongoose
  .connect("mongodb+srv://rmjimj:rmjim123@cluster0.hex75.mongodb.net/food", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"))
  .catch(() => console.log("not"));

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`start server ${port}`);
});
