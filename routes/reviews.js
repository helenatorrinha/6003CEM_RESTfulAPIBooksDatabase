const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/reviews'}); // Define the route prefix
const model = require('../models/reviews');

// Validation functions
const { validateReview } = require('../controllers/validation');
const { validateReviewUpdate } = require('../controllers/validation');

// Routes 
router.post('/', bodyParser(), validateReview, createReview);  
router.get('/', getAll); 
router.get('/:id([0-9]{1,})', getReviewsByBookId);
router.put('/:id([0-9]{1,})', bodyParser(), validateReviewUpdate, updateReview);  
router.del('/:id([0-9]{1,})', deleteReview);  

// Function to get all the reviews
async function getAll(ctx){  
    let reviews = await model.getAll();
    if (reviews.length) {
      ctx.status = 200; // OK
      ctx.body = reviews;
    } 
    else {
      ctx.status = 404; // Not found
    }
}  

// Function to get all the reviews for a book using its id
async function getReviewsByBookId(ctx) {
    let id = ctx.params.id;
    let reviews = await model.getReviewsByBookId(id);
    if (reviews.length) {
      ctx.body = reviews;
    }
    else {
      ctx.status = 404; // Not found
    }
}

// Function to add a new author in the database
async function createReview(ctx) {
    const body = ctx.request.body;
    let result = await model.add(body);
    if (result) {
      ctx.status = 201;
      ctx.body = {ID: result.insertId}
    }
    else {
      ctx.status = 400; // Bad request
    }
  }

// Function to update an review in the database
async function updateReview(ctx) {
  const body = ctx.request.body;
  const id = ctx.params.id;
  let result = await model.update(body, id);
  if (result) {
    ctx.status = 201;
    ctx.body = {message: "Update successful"}
  }
  else {
    ctx.status = 400; // Bad request
  }
  
}

// Function to delete an review in the database
async function deleteReview(ctx) {
  let id = ctx.params.id;
  let result = await model.delete(id);
    if (result) {
      ctx.status = 201;
      ctx.body = {message: "Delete successful"}
    }
    else {
      ctx.status = 400; // Bad request
    }
}

module.exports = router;