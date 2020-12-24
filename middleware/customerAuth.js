const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("customer-auth-token");
  console.log(token);
  if (!token) {
    res.status(401).send("no token provided");
    return;
  }
  try {
    const decoded = jwt.verify(token, config.get("CustomerjwtPrivatekey"));
    console.log(decoded);
    req.authUser = decoded;
    next();
  } catch (ex) {
    res.status(400).send("invalid");
  }
}
module.exports = auth;
