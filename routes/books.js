
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
const model = require('../models/books');
const can = require('../permissions/books');
const auth = require('../controllers/auth');

const prefix = '/api/v1/books';
const router = Router({prefix : prefix}); // Define the route prefix

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
      
      //hateoas
      books[0].links = {
        author: `${ctx.protocol}://${ctx.host}/api/v1/authors/${books[0].author_id}`,
        genre: `${ctx.protocol}://${ctx.host}/api/v1/genres/${books[0].genre_id}`
      }
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
    console.error('Error retrieving the books: ', error); // Log the error 
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

      //hateoas
      book.links = {
        author: `${ctx.protocol}://${ctx.host}/api/v1/authors/${book.author_id}`,
        genre: `${ctx.protocol}://${ctx.host}/api/v1/genres/${book.genre_id}`
      }
      ctx.status = 200; // OK
      ctx.body = book;
    }
    else {
      ctx.status = 404; // Not found
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the book' };
    console.error('Error retrieving the book: ', error); // Log the error 
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
    console.error('Error adding the book: ', error); // Log the error 
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
    console.error('Error updating the book: ',error); // Log the error 
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
    console.error('Error deleting the book: ',error); // Log the error 
  }
}

module.exports = router;