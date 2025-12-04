# Vehicle Reviews Enhancement - Implementation Guide

## Overview

This enhancement adds a **Vehicle Reviews System** to the CSE 340 inventory application. Users can:

- Add reviews for vehicles they've viewed
- Rate vehicles 1-5 stars
- View all reviews for a vehicle with average ratings
- Delete their own reviews (or admins can delete any review)

## Features Implemented

### 1. **Database**

- New `review` table with fields:
  - `review_id` (Primary Key, auto-increment)
  - `inv_id` (Foreign Key to inventory)
  - `account_id` (Foreign Key to account)
  - `review_rating` (1-5 stars)
  - `review_text` (text content)
  - `review_created_at` (timestamp)
  - Unique constraint on `(inv_id, account_id)` - one review per user per vehicle

### 2. **Model** (`models/review-model.js`)

- `getReviewsByInventory(inv_id)` - Fetch all reviews for a vehicle
- `getReviewStats(inv_id)` - Get average rating and review count
- `addReview(inv_id, account_id, rating, text)` - Create new review
- `getReviewById(review_id)` - Fetch single review
- `deleteReview(review_id)` - Delete a review
- `checkExistingReview(inv_id, account_id)` - Prevent duplicate reviews

### 3. **Controller** (`controllers/reviewController.js`)

- `buildAddReview` - Display add review form
- `submitReview` - Process form submission with validation
- `deleteReview` - Handle review deletion with permission checks

### 4. **Routes** (`routes/reviewRoute.js`)

- `GET /review/add/:id` - Show review form (requires login)
- `POST /review/add` - Submit review (requires login)
- `GET /review/delete/:id` - Delete review (requires login, ownership check)

### 5. **Views**

- `views/review/add-review.ejs` - Add review form with validation
- `views/review/reviews-display.ejs` - Display all reviews for a vehicle
- Updated `views/inventory/detail.ejs` - Includes reviews section

## How to Use

### Adding a Review

1. Go to any vehicle detail page
2. Scroll to "Customer Reviews" section
3. Click "Add Your Review" button (must be logged in)
4. Select 1-5 star rating
5. Write review (10-500 characters)
6. Click "Submit Review"

### Viewing Reviews

- Reviews appear on vehicle detail page with:
  - User's name and date
  - Star rating display
  - Review text
  - Average rating and review count at top

### Deleting Reviews

- Users can delete their own reviews
- Admins can delete any review
- Click "Delete" link next to review

## Database Setup

Run this SQL to create the reviews table:

```sql
CREATE TABLE IF NOT EXISTS review (
    review_id SERIAL PRIMARY KEY,
    inv_id INTEGER NOT NULL REFERENCES inventory(inv_id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    review_rating INTEGER NOT NULL CHECK (review_rating >= 1 AND review_rating <= 5),
    review_text TEXT NOT NULL,
    review_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(inv_id, account_id)
);

CREATE INDEX IF NOT EXISTS idx_review_inv_id ON review(inv_id);
CREATE INDEX IF NOT EXISTS idx_review_account_id ON review(account_id);
```

Or copy and run: `database/add-reviews-table.sql`

## Testing Checklist

- [ ] Register new account
- [ ] Login to account
- [ ] Navigate to vehicle detail page
- [ ] Click "Add Your Review"
- [ ] Submit review with valid data (rating 1-5, text 10-500 chars)
- [ ] See review appear on detail page
- [ ] See star rating and average calculated correctly
- [ ] Try adding duplicate review (should be prevented)
- [ ] View review from another account
- [ ] Delete your own review
- [ ] Logout and verify review still visible
- [ ] Test as admin (can delete any review)

## Best Practices Applied

✅ **MVC Architecture**: Separated Model (database), View (EJS templates), Controller (business logic)
✅ **Parameterized Queries**: All SQL uses `$1, $2` parameters to prevent SQL injection
✅ **Input Validation**: Server-side validation on rating (1-5) and text length (10-500)
✅ **Error Handling**: Try-catch blocks with user-friendly error messages
✅ **Authentication**: Protected routes require login via `checkLogin` middleware
✅ **Authorization**: Users can only delete their own reviews (or admins any review)
✅ **Data Integrity**: Unique constraint prevents duplicate reviews
✅ **User Experience**: Visual feedback, character counter, average rating display

## Files Added/Modified

### New Files:

- `database/add-reviews-table.sql`
- `models/review-model.js`
- `controllers/reviewController.js`
- `routes/reviewRoute.js`
- `views/review/add-review.ejs`
- `views/review/reviews-display.ejs`

### Modified Files:

- `server.js` - Added review route mounting
- `controllers/invController.js` - Updated to fetch reviews for detail page
- `views/inventory/detail.ejs` - Included reviews section
