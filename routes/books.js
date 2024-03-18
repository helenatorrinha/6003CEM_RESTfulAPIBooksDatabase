
/**
 * @module routes/books
 * @description API routes for managing books, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires models/books
 * @requires controllers/auth
 * @requires permissions/books
 * @requires controllers/validation
 * @see models/books for database operations
 * @see controllers/auth for auth middleware
 * @see permissions/books for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/books'}); // Define the route prefix
const model = require('../models/books');
const can = require('../permissions/books');
const auth = require('../controllers/auth');

// Validation functions
const { validateBook } = require('../controllers/validation');
const { validateBookUpdate } = require('../controllers/validation');

// Routes 
router.get('/', getAll);  
router.post('/', bodyParser(), auth, validateBook, createBook);  
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateBookUpdate, updateBook);  
router.del('/:id([0-9]{1,})', auth, deleteBook);  

/** Function to get all the books
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the books
 * @throws {Error} Throws an error if the query fails
 */
async function getAll(ctx){  
  try {
    let books = await model.getAll();
    if (books.length) {
      ctx.status = 200; // OK
      ctx.body = books;
    } 
    else {
      ctx.status = 404; // Not found
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the books' };
  }
}  

/** Function to get a single book by its id
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the book
 * @throws {Error} Throws an error if the query fails
 */
async function getById(ctx) {
  try {
    let id = ctx.params.id;
    let book = await model.getById(id);
    if (book) {
      ctx.status = 200; // OK
      ctx.body = book;
    }
    else {
      console.log("here4")
      ctx.status = 404; // Not found
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the book' };
  }
}

/** Function to add a new book in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the book
 * @throws {Error} Throws an error if the query fails
 * @throws {Error} Throws an error if the author or genre is not found
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
async function createBook(ctx) {
  try {
    const permission = can.create(ctx.state.user);
    if (!permission.granted) { // If the user does not have permission to create a book
      ctx.status = 403; // Forbidden
      ctx.body = { error: 'You are not authorized to add a book' };
      return;
    }

    const body = ctx.request.body;
    let result = await model.add(body);
    if (result.error) { // If the result has an error property
      ctx.status = 400; // Bad request
      ctx.body = { error: result.error };
      return; 
    }

    if (result.insertId) { // If result has an insertId (insertion was successful)
      ctx.status = 201; // Created
      ctx.body = { ID: result.insertId };
    } else { 
      ctx.status = 400; // Bad request
      ctx.body = { error: 'Failed to add the book' };
    }
  } catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to add the book' };
    console.error(error); // Log the error for debugging purposes
  }
}

/** Function to update a book in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the book
 * @throws {Error} Throws an error if the query fails
 */
async function updateBook(ctx) {
  try {
    const permission = can.update(ctx.state.user);
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
    }
    else { 
      const body = ctx.request.body;
      const id = ctx.params.id;
      let result = await model.update(body, id);
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
    ctx.body = { error: 'Failed to update the book' };
  }
}

/** Function to delete a book in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the book
 * @throws {Error} Throws an error if the query fails
 */
async function deleteBook(ctx) {
  try {
    const permission = can.delete(ctx.state.user);
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
    }
    else { 
      let id = ctx.params.id;
      let result = await model.delete(id);
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
    ctx.body = { error: 'Failed to delete the book' };
  }
}

module.exports = router;