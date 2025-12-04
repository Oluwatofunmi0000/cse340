const reviewModel = require("../models/review-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const { validationResult } = require("express-validator");

const reviewCont = {};

/* ****************************************
 * Build add review form
 * *************************************** */
reviewCont.buildAddReview = async function (req, res) {
  try {
    const inv_id = parseInt(req.params.id);
    let nav = await utilities.getNav();
    
    // Get vehicle details to display in form
    const vehicle = await invModel.getInventoryById(inv_id);
    if (!vehicle) {
      req.session.message = "Vehicle not found.";
      return res.redirect("/");
    }

    // Check if user already reviewed this vehicle
    const existingReview = await reviewModel.checkExistingReview(inv_id, req.user.account_id);
    if (existingReview) {
      req.session.message = "You have already reviewed this vehicle.";
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    res.render("review/add-review", {
      title: "Add Review",
      nav,
      inv_id,
      vehicle,
      errors: [],
    });
  } catch (error) {
    console.error("buildAddReview error:", error);
    req.session.message = "Error loading review form.";
    res.redirect("/");
  }
};

/* ****************************************
 * Submit new review
 * *************************************** */
reviewCont.submitReview = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    const errors = validationResult(req);
    const { inv_id, review_rating, review_text } = req.body;
    const account_id = res.locals.accountData.account_id;

    if (!errors.isEmpty()) {
      const vehicle = await invModel.getInventoryById(inv_id);
      return res.status(400).render("review/add-review", {
        title: "Add Review",
        nav,
        inv_id,
        vehicle,
        errors: errors.array(),
        review_rating,
        review_text,
      });
    }

    // Check if user already reviewed this vehicle
    const existingReview = await reviewModel.checkExistingReview(inv_id, account_id);
    if (existingReview) {
      const vehicle = await invModel.getInventoryById(inv_id);
      return res.status(400).render("review/add-review", {
        title: "Add Review",
        nav,
        inv_id,
        vehicle,
        errors: [{ msg: "You have already reviewed this vehicle." }],
        review_rating,
        review_text,
      });
    }

    const reviewResult = await reviewModel.addReview(inv_id, account_id, review_rating, review_text);

    if (reviewResult) {
      req.session.message = "Review submitted successfully!";
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    const vehicle = await invModel.getInventoryById(inv_id);
    res.status(500).render("review/add-review", {
      title: "Add Review",
      nav,
      inv_id,
      vehicle,
      errors: [{ msg: "Failed to submit review. Please try again." }],
      review_rating,
      review_text,
    });
  } catch (error) {
    console.error("submitReview error:", error);
    let nav = await utilities.getNav();
    res.status(500).render("review/add-review", {
      title: "Add Review",
      nav,
      errors: [{ msg: "An error occurred: " + error.message }],
    });
  }
};

/* ****************************************
 * Delete review
 * *************************************** */
reviewCont.deleteReview = async function (req, res) {
  try {
    const review_id = parseInt(req.params.id);
    
    const review = await reviewModel.getReviewById(review_id);
    if (!review) {
      req.session.message = "Review not found.";
      return res.redirect("/");
    }

    // Check if user owns this review (or is admin)
    if (review.account_id !== res.locals.accountData.account_id && res.locals.accountData.account_type !== "Admin") {
      req.session.message = "You can only delete your own reviews.";
      return res.redirect(`/inv/detail/${review.inv_id}`);
    }

    const deleteResult = await reviewModel.deleteReview(review_id);
    if (deleteResult) {
      req.session.message = "Review deleted successfully.";
      return res.redirect(`/inv/detail/${review.inv_id}`);
    }

    req.session.message = "Failed to delete review.";
    res.redirect(`/inv/detail/${review.inv_id}`);
  } catch (error) {
    console.error("deleteReview error:", error);
    req.session.message = "An error occurred while deleting the review.";
    res.redirect("/");
  }
};

module.exports = reviewCont;
