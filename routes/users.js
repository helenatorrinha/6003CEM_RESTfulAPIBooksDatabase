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

//Function to get all the users in the database
async function getAll(ctx) {
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
      ctx.body = result; // Return the users
    } else {
      ctx.status = 404; // Not found
    }
  }
}

//Function to get a single user by its id
async function getById(ctx) {
  let id = ctx.params.id;
  const permission = can.read(ctx.state.user, parseInt(id));
  if (!permission.granted) {
    ctx.status = 403; // Forbidden
  } 
  else
  {
    let user = await model.getById(id); // Get the user from the model
    if (user.length) { // If some result is returned
      ctx.body = user[0]; // Return the user
    }
    else {
      ctx.status = 404; // Not found
    }
  }
}

// Function to add a new user in the database
async function createUser(ctx) {
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

// Function to update an autusershor in the database
async function updateUser(ctx) {
  const id = ctx.params.id;
  const permission = can.update(ctx.state.user, parseInt(id));
  if (!permission.granted) {
    ctx.status = 403;
  }
  else { 
    const body = ctx.request.body;
    let result = await model.update(body, id);
    if (result) {
      ctx.status = 201; // Created
      ctx.body = {message: "Updated Successful"}
    }
    else {
      ctx.status = 400; // Bad request
    }
  }
}

// Function to delete a user in the database
async function deleteUser(ctx) {
  let id = ctx.params.id;
  const permission = can.delete(ctx.state.user, parseInt(id));
  if (!permission.granted) {
    ctx.status = 403;
  }
  else { 
    let result = await model.delete(id);
    if (result) {
      ctx.status = 201;
      ctx.body = {message: "Delete successful"}
    }
    else {
      ctx.status = 400; // Bad request
    }
  }
}

module.exports = router;