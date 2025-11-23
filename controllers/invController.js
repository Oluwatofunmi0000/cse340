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

/* ***************************
 *  Management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  });
};

/* ***************************
 *  Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: [],
    classification_name: "",
  });
};

/* ***************************
 *  Insert Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const success = await invModel.addClassification(classification_name);
  const nav = await utilities.getNav();
  if (success) {
    req.session.message = "Classification added successfully.";
    return res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  }
  res.status(500).render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: [{ msg: "Failed to add classification. Try a different name." }],
    classification_name,
  });
};

/* ***************************
 *  Add Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: [],
    classificationList,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  });
};

/* ***************************
 *  Insert Inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const payload = {
    inv_make: req.body.inv_make,
    inv_model: req.body.inv_model,
    inv_year: parseInt(req.body.inv_year),
    inv_description: req.body.inv_description,
    inv_image: req.body.inv_image,
    inv_thumbnail: req.body.inv_thumbnail,
    inv_price: parseFloat(req.body.inv_price),
    inv_miles: parseInt(req.body.inv_miles),
    inv_color: req.body.inv_color,
    classification_id: parseInt(req.body.classification_id),
  };
  const success = await invModel.addInventory(payload);
  if (success) {
    req.session.message = "Vehicle added successfully.";
    return res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  }
  const classificationList = await utilities.buildClassificationList(payload.classification_id);
  res.status(500).render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: [{ msg: "Failed to add vehicle. Please review inputs." }],
    classificationList,
    ...payload,
  });
};

module.exports = invCont;
