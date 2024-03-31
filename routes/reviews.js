/**
 * @module routes/reviews
 * @description API routes for managing reviews, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires models/reviews
 * @requires controllers/auth
 * @requires permissions/reviews
 * @requires controllers/validation
 * @see models/reviews for database operations
 * @see controllers/auth for auth middleware
 * @see permissions/reviews for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/reviews'}); // Define the route prefix
const model = require('../models/reviews');
const can = require('../permissions/reviews');
const auth = require('../controllers/auth');

// Validation functions
const { validateReview } = require('../controllers/validation');
const { validateReviewUpdate } = require('../controllers/validation');

// Routes 
router.post('/', bodyParser(), auth, validateReview, createReview);  
router.get('/', getAll); 
router.get('/:id([0-9]{1,})', getReviewsByBookId);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateReviewUpdate, updateReview);  
router.del('/:id([0-9]{1,})', auth, deleteReview);  

/** Function to get all the reviews
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the reviews
 * @throws {Error} Throws an error if the query fails
 */
async function getAll(ctx){  
  try {
    let reviews = await model.getAll();
    if (reviews.length) {
      ctx.status = 200; // OK
      ctx.body = reviews;
    } 
    else {
      ctx.status = 404; // Not found
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the reviews' };
    console.error('Error retrieving the reviews: ', error); // Log the error 
  }
}  

/** Function to get all the reviews for a book using its id
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the reviews
 * @throws {Error} Throws an error if the query fails
 */
async function getReviewsByBookId(ctx) {
  try {
    let bookId = ctx.params.id;
    let reviews = await model.getReviewsByBookId(bookId);
    if (reviews.length) {
      ctx.status = 200; // OK
      ctx.body = reviews;
    }
    else {
      ctx.status = 404; // Not found
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the reviews' };
    console.error('Error retrieving the reviews: ', error); // Log the error 
  }
}

/** Function to add a new author in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the author
 * @throws {Error} Throws an error if the query fails
 */
async function createReview(ctx) {
  try {
    const permission = can.create(ctx.state.user);
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
    }
    else { 
      const body = ctx.request.body;
      let result = await model.add(body);
      if (result) {
        ctx.status = 201; // Created
        ctx.body = {ID: result.insertId}
      }
      else {
        ctx.status = 400; // Bad request
      }
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to add the review' };
    console.error('Error adding the review: ', error); // Log the error 
  }
}

/** Function to update a review in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the review
 * @throws {Error} Throws an error if the query fails
 */
async function updateReview(ctx) {
  try {
    const reviewId = ctx.params.id;
    const review = await model.getReviewById(reviewId); // Get the review from the model
    if (!review) { // If the review is not found
      ctx.status = 404; // Not found
      ctx.body = {message: "Review not found."};
      return;
    }
    const permission = can.update(ctx.state.user, review.user_id);
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
    }
    else {
      const body = ctx.request.body;
      let result = await model.update(body, reviewId);
      if (result) {
        ctx.status = 200; // OK
        ctx.body = {message: "Update successful"}
      }
      else {
        ctx.status = 400; // Bad request
      }
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to update the review' };
    console.error('Error updating the review: ', error); // Log the error 
  }
}

/** Function to delete an review in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the review
 * @throws {Error} Throws an error if the query fails
 */
async function deleteReview(ctx) {
  try {
    const reviewId = ctx.params.id;
    const review = await model.getReviewById(reviewId); // Get the review from the model
    if (!review) { // If the review is not found
      ctx.status = 404; // Not found
      ctx.body = {message: "Review not found."};
      return;
    }
    const permission = can.delete(ctx.state.user, parseInt(review.user_id));
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
    }
    else {
      let result = await model.delete(reviewId);
      if (result) {
        ctx.status = 200; // OK
        ctx.body = {message: "Delete successful"}
      }
      else {
        ctx.status = 400; // Bad request
      }
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to delete the review' };
    console.error('Error deleting the review: ', error); // Log the error 
  }
}

module.exports = router;