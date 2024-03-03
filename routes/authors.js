const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/authors'}); // Define the route prefix
const model = require('../models/authors');
const can = require('../permissions/authors');
const auth = require('../controllers/auth');

// Validation functions
const { validateAuthor } = require('../controllers/validation');
const { validateAuthorUpdate } = require('../controllers/validation');

// Routes 
router.get('/', getAll);  
router.post('/', bodyParser(), auth, validateAuthor, createAuthor);  
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateAuthorUpdate, updateAuthor);  
router.del('/:id([0-9]{1,})', auth, deleteAuthor);  

// Function to get all the authors
async function getAll(ctx){  
    let authors = await model.getAll();
    if (authors.length) {
      ctx.status = 200; // OK
      ctx.body = authors;
    } 
    else {
      ctx.status = 404; // Not found
    }
}  

// Function to get a single author by its id
async function getById(ctx) {
  let id = ctx.params.id;
  let author = await model.getById(id);
  if (author.length) {
    
    ctx.body = author[0];
  }
  else {
    ctx.status = 404; // Not found
  }
}

// Function to add a new author in the database
async function createAuthor(ctx) {
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

// Function to update an author in the database
async function updateAuthor(ctx) {
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

// Function to delete an author in the database
async function deleteAuthor(ctx) {
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

module.exports = router;