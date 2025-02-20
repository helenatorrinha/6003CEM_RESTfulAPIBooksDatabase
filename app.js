/**
 * @file index.js
 * @module index
 * @description The main entry point for the application
 * @requires koa
 * @requires routes/authors
 * @requires routes/books
 * @requires routes/genres
 * @requires routes/reviews
 * @requires routes/user
 * @requires routes/special
 * @requires config
 * @requires Koa
 * @requires cors
 */

const Koa = require('koa');
const app = new Koa();

const authors = require('./routes/authors.js')
const books = require('./routes/books.js');
const genres = require('./routes/genres.js');
const reviews = require('./routes/reviews.js');
const users = require('./routes/users.js');
const special = require('./routes/special.js')
const cors = require('@koa/cors');

app.use(cors());
app.use(authors.routes());
app.use(books.routes());
app.use(genres.routes());
app.use(reviews.routes());
app.use(users.routes());
app.use(special.routes());

module.exports = app;
