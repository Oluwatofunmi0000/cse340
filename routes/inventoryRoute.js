// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const {
	classificationRules,
	checkClassificationData,
	inventoryRules,
	checkInventoryData,
} = require("../middleware/validation");

// Management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail));

// Route to trigger intentional error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

// Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post(
	"/add-classification",
	classificationRules,
	checkClassificationData,
	utilities.handleErrors(invController.addClassification)
);

// Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post(
	"/add-inventory",
	inventoryRules,
	checkInventoryData,
	utilities.handleErrors(invController.addInventory)
);

module.exports = router;
