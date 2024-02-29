const Router = require('koa-router'); // Import the koa-router (to parse request bodies)
const bodyParser = require('koa-bodyparser'); // Import the koa-bodyparser
const router = Router({prefix: '/api/v1/genres'}); // Define the route prefix
const model = require('../models/genres');

// Validation functions
const { validateGenre } = require('../controllers/validation');
const { validateGenreUpdate } = require('../controllers/validation');

// Routes 
router.get('/', getAll);  
router.post('/', bodyParser(), validateGenre, createGenre);  
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), validateGenreUpdate, updateGenre);  
router.del('/:id([0-9]{1,})', deleteGenre);  

// Function to get all the genres
async function getAll(ctx){  
    let genres = await model.getAll();
    if (genres.length) {
      ctx.status = 200; // OK
      ctx.body = genres;
    } 
    else {
      ctx.status = 404; // Not found
    }
}  

// Function to get a single genre by its id
async function getById(ctx) {
  let id = ctx.params.id;
  let genre = await model.getById(id);
  if (genre.length) {
    
    ctx.body = genre[0];
  }
  else {
    ctx.status = 404; // Not found
  }
}

// Function to add a new genre in the database
async function createGenre(ctx) {
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

// Function to update an genre in the database
async function updateGenre(ctx) {
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

// Function to delete an genre in the database
async function deleteGenre(ctx) {
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