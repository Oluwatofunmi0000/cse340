const { body, validationResult } = require("express-validator");
const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");

// Classification name must be alphanumeric, no spaces or special chars
const classificationRules = [
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required.")
    .matches(/^[A-Za-z0-9]+$/).withMessage("No spaces or special characters allowed."),
];

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name || "",
    });
  }
  next();
};

// Inventory rules
const inventoryRules = [
  body("inv_make").trim().notEmpty().withMessage("Make is required."),
  body("inv_model").trim().notEmpty().withMessage("Model is required."),
  body("inv_year").trim().isInt({ min: 1900, max: 2100 }).withMessage("Year must be valid (1900-2100)."),
  body("inv_price").trim().isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
  body("inv_miles").trim().isInt({ min: 0 }).withMessage("Miles must be 0 or greater."),
  body("inv_color").trim().notEmpty().withMessage("Color is required."),
  body("inv_image").trim().notEmpty().withMessage("Image path is required."),
  body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
  body("classification_id").trim().isInt({ min: 1 }).withMessage("Choose a classification."),
  body("inv_description").trim().notEmpty().withMessage("Description is required."),
];

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(parseInt(req.body.classification_id) || null);
    return res.status(400).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: errors.array(),
      classificationList,
      // Sticky values
      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_year: req.body.inv_year || "",
      inv_description: req.body.inv_description || "",
      inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.png",
      inv_price: req.body.inv_price || "",
      inv_miles: req.body.inv_miles || "",
      inv_color: req.body.inv_color || "",
    });
  }
  next();
};

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
};
