const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  let nav = await utilities.getNav();
  // If no data, render notice
  if (!data || data.length === 0) {
    return res.status(200).render("./inventory/classification", {
      title: "Inventory",
      nav,
      grid: '<p class="notice">No vehicles found for this classification.</p>'
    });
  }
  const grid = await utilities.buildClassificationGrid(data);
  const className = data[0].classification_name;
  res.render("./inventory/classification", { title: className + " vehicles", nav, grid });
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.invId;
  const vehicle = await invModel.getVehicleById(inv_id);
  
  if (!vehicle) {
    const error = new Error("Vehicle not found");
    error.status = 404;
    return next(error);
  }
  
  const detail = utilities.buildVehicleDetail(vehicle);
  let nav = await utilities.getNav();
  const vehicleTitle = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
  
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    detail,
  });
};

/* ***************************
 *  Intentional error for testing
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  const error = new Error("This is an intentional 500 error for testing purposes.");
  error.status = 500;
  throw error;
};

module.exports = invCont;
