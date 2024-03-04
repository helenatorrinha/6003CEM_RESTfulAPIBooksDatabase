/**
 * @module routes/genres
 * @description API routes for managing genres, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires models/genres
 * @requires controllers/auth
 * @requires permissions/genres
 * @requires controllers/validation
 * @see models/genres for database operations
 * @see controllers/auth for auth middleware
 * @see permissions/genres for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/genres'}); // Define the route prefix
const model = require('../models/genres');
const can = require('../permissions/genres');
const auth = require('../controllers/auth');

// Validation functions
const { validateGenre } = require('../controllers/validation');
const { validateGenreUpdate } = require('../controllers/validation');

// Routes 
router.get('/', getAll);  
router.post('/', bodyParser(), auth, validateGenre, createGenre);  
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateGenreUpdate, updateGenre);  
router.del('/:id([0-9]{1,})', auth, deleteGenre);  

/** Function to get all the genres
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the genres
 * @throws {Error} Throws an error if the query fails
 */
async function getAll(ctx){  
  try {
    let genres = await model.getAll();
    if (genres.length) {
      ctx.status = 200; // OK
      ctx.body = genres;
    } 
    else {
      ctx.status = 404; // Not found
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the genres' };
  } 
}  

/** Function to get a single genre by its id
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the genre
 * @throws {Error} Throws an error if the query fails
 */
async function getById(ctx) {
  try {
    let id = ctx.params.id;
    let genre = await model.getById(id);
    if (genre.length) {
      ctx.status = 200; // OK
      ctx.body = genre[0];
    }
    else {
      ctx.status = 404; // Not found
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the genre' };
  }
}

/** Function to add a new genre in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the genre
 * @throws {Error} Throws an error if the query fails
 */
async function createGenre(ctx) {
  try {
    const permission = can.create(ctx.state.user);
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
      return;
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
    ctx.body = { error: 'Failed to add the genre' };
  }
}

/** Function to update an genre in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the genre
 * @throws {Error} Throws an error if the query fails
 */
async function updateGenre(ctx) {
  try {
    const permission = can.create(ctx.state.user);
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
      return;
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
    ctx.body = { error: 'Failed to update the genre' };
  }
}

/** Function to delete an genre in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the genre
 * @throws {Error} Throws an error if the query fails
 */
async function deleteGenre(ctx) {
  try {
    const permission = can.create(ctx.state.user);
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
      return;
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
    ctx.body = { error: 'Failed to delete the genre' };
  }
}

module.exports = router;