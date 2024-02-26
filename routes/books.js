
const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/books'}); // Define the route prefix
const model = require('../models/books');

let books = [
  {title:'hello article', fullText:'some text here to fill the body'},
  {title:'another article', fullText:'again here is some text here to fill'},
  {title:'coventry university ', fullText:'some news about coventry university'}
];  

// Routes 
router.get('/', getAll);  
router.post('/', bodyParser(), createBook);  
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', updateBook);  
router.del('/:id([0-9]{1,})', deleteBook);  

// Function to get all the books
async function getAll(cnx, next){  
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

// Function to update a book in the database
async function updateBook(ctx) {
  const body = ctx.request.body;
  let result = await model.update(body);
  if (result) {
    ctx.status = 201;
    ctx.body = {message: "Update successful"}
  }
  else {
    ctx.status = 400; // Bad request
  }
  
}

// Function to delete a book in the database
async function deleteBook(ctx) {
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