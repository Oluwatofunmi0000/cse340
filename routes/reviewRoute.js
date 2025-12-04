const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/");
const { checkLogin } = require("../middleware/auth");
const { body } = require("express-validator");

// Review validation rules
const reviewRules = [
  body("review_rating")
    .trim()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5 stars."),
  body("review_text")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Review must be between 10 and 500 characters."),
];

// Add review form (protected - logged in users only)
router.get(
  "/add/:id",
  checkLogin,
  utilities.handleErrors(reviewController.buildAddReview)
);

// Submit review (protected - logged in users only)
router.post(
  "/add",
  checkLogin,
  reviewRules,
  utilities.handleErrors(reviewController.submitReview)
);

// Delete review (protected - logged in users only)
router.get(
  "/delete/:id",
  checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;
