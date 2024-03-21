/**
 * @module routes/users
 * @description API routes for managing users, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires models/users
 * @requires controllers/auth
 * @requires permissions/users
 * @requires controllers/validation
 * @see models/users for database operations
 * @see controllers/auth for auth middleware
 * @see permissions/users for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/users'}); // Define the route prefix
const model = require('../models/users');
const can = require('../permissions/users');
const auth = require('../controllers/auth');

// Validation functions
const { validateUser } = require('../controllers/validation');
const { validateUserUpdate } = require('../controllers/validation');

// Routes 
router.get('/', auth, getAll);  
router.get('/:id([0-9]{1,})', auth, getById);
router.post('/', bodyParser(), validateUser, createUser);  
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateUserUpdate, updateUser);  
router.del('/:id([0-9]{1,})', auth, deleteUser);  

/** Function to get all the users in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the users
 * @throws {Error} Throws an error if the query fails
 */
async function getAll(ctx) {
  try {
    const permission = can.readAll(ctx.state.user);
    if (!permission.granted) // If the user does not have permission to read all users
    { 
      ctx.status = 403; // Forbidden
    } 
    else // If the user has permission to read all users
    {
      const result = await model.getAll(); // Get all the users from the model
      if (result.length) { // If some result is returned
        ctx.status = 200; // OK
        ctx.body = permission.filter(result); // Return the users
      } else {
        ctx.status = 404; // Not found
      }
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the users' };
  }
}

/** Function to get a single user by its id
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the user
 * @throws {Error} Throws an error if the query fails
 */
async function getById(ctx) {
  try {
    let id = ctx.params.id;
    const permission = can.read(ctx.state.user, parseInt(id));
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
    } 
    else
    {
      let user = await model.getById(id); // Get the user from the model
      if (user.length) { // If some result is returned
        ctx.status = 200; // OK
        ctx.body = permission.filter(user[0]); // Return the user
      }
      else {
        ctx.status = 404; // Not found
      }
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to retrieve the user' };
  } 
}

/** Function to add a new user in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the user
 * @throws {Error} Throws an error if the query fails
 */
async function createUser(ctx) {
  try {
    const body = ctx.request.body;
    let result = await model.add(body); // Add the user to the model
    if (result) {
      ctx.status = 201; // Created
      ctx.body = {ID: result.insertId} // Return the ID of the new user
    }
    else {
      ctx.status = 400; // Bad request
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to add the user' };
  }
}

/** Function to update an autusershor in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the user
 * @throws {Error} Throws an error if the query fails
 */
async function updateUser(ctx) {
  try {
    const id = ctx.params.id;
    const permission = can.update(ctx.state.user, parseInt(id));
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
    }
    else { 
      const body = ctx.request.body;
      let result = await model.update(body, id);
      if (result) {
        ctx.status = 200; // OK
        ctx.body = {message: "Updated Successful"}
      }
      else {
        ctx.status = 400; // Bad request
      }
    }
  } 
  catch (error) {
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Failed to update the user' };
  }
}

/** Function to delete a user in the database
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the user
 * @throws {Error} Throws an error if the query fails
 */
async function deleteUser(ctx) {
  try {
    let id = ctx.params.id;
    const permission = can.delete(ctx.state.user, parseInt(id));
    if (!permission.granted) {
      ctx.status = 403; // Forbidden
    }
    else { 
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
    ctx.body = { error: 'Failed to delete the user' };
  }
}
module.exports = router;