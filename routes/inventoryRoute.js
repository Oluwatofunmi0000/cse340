// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const { checkAccountType } = require("../middleware/auth");
const {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
} = require("../middleware/validation");

// Management view (protected)
router.get("/", checkAccountType, utilities.handleErrors(invController.buildManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail));

// Route to trigger intentional error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

// Add Classification (protected)
router.get("/add-classification", checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.post(
  "/add-classification",
  checkAccountType,
  classificationRules,
  checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add Inventory (protected)
router.get("/add-inventory", checkAccountType, utilities.handleErrors(invController.buildAddInventory));
router.post(
  "/add-inventory",
  checkAccountType,
  inventoryRules,
  checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
