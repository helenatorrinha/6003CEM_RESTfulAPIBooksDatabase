
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

// Function to get all the books
async function getAll(ctx){  
    let books = await model.getAll();
    if (books.length) {
      ctx.status = 200; // OK
      ctx.body = books;
    } 
    else {
      ctx.status = 404; // Not found
    }
}  

// Function to get a single book by its id
async function getById(ctx) {
  let id = ctx.params.id;
  let book = await model.getById(id);
  if (book.length) {
    
    ctx.body = book[0];
  }
  else {
    ctx.status = 404; // Not found
  }
}

// Function to add a new book in the database
async function createBook(ctx) {
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

// Function to update a book in the database
async function updateBook(ctx) {
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

// Function to delete a book in the database
async function deleteBook(ctx) {
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