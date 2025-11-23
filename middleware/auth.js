const { verifyToken } = require("../utilities/jwt");

/* ****************************************
 *  Check Login Middleware
 *  Reads JWT cookie, verifies it, exposes payload to res.locals
 **************************************** */
function checkLogin(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      res.locals.loggedin = true;
      res.locals.accountData = payload;
      return next();
    }
  }
  res.locals.loggedin = false;
  res.locals.accountData = null;
  next();
}

/* ****************************************
 *  Check Account Type Middleware
 *  Allows only Employee or Admin
 **************************************** */
function checkAccountType(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    req.session.message = "Please log in to access this resource.";
    return res.redirect("/account/login");
  }
  const payload = verifyToken(token);
  if (!payload) {
    req.session.message = "Invalid session. Please log in again.";
    return res.redirect("/account/login");
  }
  if (payload.account_type === "Employee" || payload.account_type === "Admin") {
    res.locals.accountData = payload;
    return next();
  }
  req.session.message = "Access restricted to employees and administrators.";
  res.redirect("/account/login");
}

module.exports = { checkLogin, checkAccountType };
