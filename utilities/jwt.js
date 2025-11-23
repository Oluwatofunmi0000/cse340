const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.ACCESS_TOKEN_SECRET || "dev-secret-change-in-prod";
const expiration = "1h"; // Token expires in 1 hour

/* ****************************************
 *  Create JWT token
 **************************************** */
function createToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: expiration });
}

/* ****************************************
 *  Verify JWT token
 **************************************** */
function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

module.exports = { createToken, verifyToken };
