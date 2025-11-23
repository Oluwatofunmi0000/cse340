const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const { checkAccountType } = require("../middleware/auth");
const { body } = require("express-validator");

// Registration validation rules
const registrationRules = [
  body("account_firstname").trim().notEmpty().withMessage("First name is required."),
  body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
  body("account_email").trim().isEmail().withMessage("Valid email is required."),
  body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must be at least 12 characters with uppercase, lowercase, number, and symbol."),
];

// Login validation rules
const loginRules = [
  body("account_email").trim().isEmail().withMessage("Valid email is required."),
  body("account_password").trim().notEmpty().withMessage("Password is required."),
];

// Account update rules
const accountUpdateRules = [
  body("account_firstname").trim().notEmpty().withMessage("First name is required."),
  body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
  body("account_email").trim().isEmail().withMessage("Valid email is required."),
];

// Password update rules
const passwordUpdateRules = [
  body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must be at least 12 characters with uppercase, lowercase, number, and symbol."),
];

// Registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", registrationRules, utilities.handleErrors(accountController.registerAccount));

// Login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", loginRules, utilities.handleErrors(accountController.accountLogin));

// Account Management (protected)
router.get("/", utilities.handleErrors(accountController.buildManagement));

// Update Account
router.get("/update/:id", utilities.handleErrors(accountController.buildUpdate));
router.post("/update", accountUpdateRules, utilities.handleErrors(accountController.updateAccount));
router.post("/update-password", passwordUpdateRules, utilities.handleErrors(accountController.updatePassword));

// Logout
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
