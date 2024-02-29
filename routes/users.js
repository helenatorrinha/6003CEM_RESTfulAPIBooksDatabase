const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/users'}); // Define the route prefix
const model = require('../models/users');

// Validation functions
const { validateUser } = require('../controllers/validation');
const { validateUserUpdate } = require('../controllers/validation');

// Routes 
router.get('/', getAll);  
router.get('/:id([0-9]{1,})', getById);
router.post('/', bodyParser(), validateUser, createUser);  
router.put('/:id([0-9]{1,})', bodyParser(), validateUserUpdate, updateUser);  
router.del('/:id([0-9]{1,})', deleteUser);  

// Function to get all the users
async function getAll(ctx){  
    let users = await model.getAll();
    if (users.length) {
      ctx.status = 200; // OK
      ctx.body = users;
    } 
    else {
      ctx.status = 404; // Not found
    }
}  

// Function to get a single user by its id
async function getById(ctx) {
  let id = ctx.params.id;
  let user = await model.getById(id);
  if (user.length) {
    
    ctx.body = user[0];
  }
  else {
    ctx.status = 404; // Not found
  }
}

// Function to add a new user in the database
async function createUser(ctx) {
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

// Function to update an autusershor in the database
async function updateUser(ctx) {
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

// Function to delete a user in the database
async function deleteUser(ctx) {
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