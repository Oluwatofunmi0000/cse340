const utilities = require("../utilities/");

/* ****************************************
* Middleware to handle errors
* Wrap async routes in this for general error handling
**************************************** */
const errorHandler = async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  // Set status code
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  res.status(status).render("errors/error", {
    title: status == 404 ? "404 - Page Not Found" : "Server Error",
    message,
    nav,
    status
  });
};

/* ****************************************
* Middleware to handle 404 errors
**************************************** */
const notFoundHandler = async (req, res, next) => {
  const err = new Error("Sorry, we couldn't find that page.");
  err.status = 404;
  next(err);
};

module.exports = { errorHandler, notFoundHandler };
