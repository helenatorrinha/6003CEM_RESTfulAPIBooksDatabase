/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 * @see schemas/* for JSON Schema definition files
 */

const {Validator, ValidationError} = require('jsonschema');
const { author: authorSchema, authorUpdate: authorUpdateSchema } = require('../schemas/author.json').definitions;
const { book: bookSchema, bookUpdate: bookUpdateSchema } = require('../schemas/book.json').definitions;
const { genre: genreSchema, genreUpdate: genreUpdateSchema } = require('../schemas/genre.json').definitions;
const { review: reviewSchema, reviewUpdate: reviewUpdateSchema } = require('../schemas/review.json').definitions;
const { user: userSchema, userUpdate: userUpdateSchema } = require('../schemas/user.json').definitions;
const { login: loginSchema } = require('../schemas/login.json').definitions;

const v = new Validator();

/** Validation function 
 * @param {Object} ctx - Koa context object
 * @param {Function} next - Koa next function
 * @param {Object} schema - JSON Schema definition
 * @returns {Promise} - Koa next function
 * @throws {ValidationError} - Koa context object
*/
async function validate(ctx, next, schema) {
  const validationOptions = { 
    throwError: true,
    allowUnknownAttributes: false
  };

  const body = ctx.request.body;

  try {
    v.validate(body, schema, validationOptions);
    await next();
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(error);
      ctx.status = 400
      ctx.body = error;  // this is the line you update
    } else {
      throw error;
    }
  }  
}

/** Validate data against author schema */
exports.validateAuthor = async (ctx, next) => {
  await validate(ctx, next, authorSchema)
}

/** Validate data against authorUpdate schema */
exports.validateAuthorUpdate = async (ctx, next) => {
  await validate(ctx, next, authorUpdateSchema)
}

/** Validate data against book schema */
exports.validateBook = async (ctx, next) => {
  await validate(ctx, next, bookSchema)
}

/** Validate data against bookUpdate schema */
exports.validateBookUpdate = async (ctx, next) => {
  await validate(ctx, next, bookUpdateSchema)
}

/** Validate data against genre schema */
exports.validateGenre = async (ctx, next) => {
  await validate(ctx, next, genreSchema)
}

/** Validate data against genreUpdate schema */
exports.validateGenreUpdate = async (ctx, next) => {
  await validate(ctx, next, genreUpdateSchema)
}

/** Validate data against review schema */
exports.validateReview = async (ctx, next) => {
  await validate(ctx, next, reviewSchema)
}

/** Validate data against reviewUpdate schema */
exports.validateReviewUpdate = async (ctx, next) => {
  await validate(ctx, next, reviewUpdateSchema)
}

/** Validate data against user schema */
exports.validateUser = async (ctx, next) => {
  await validate(ctx, next, userSchema)
}

/** Validate data against userUpdate schema */
exports.validateUserUpdate = async (ctx, next) => {
  await validate(ctx, next, userUpdateSchema)
}

/** Validate data against login schema */
exports.validateLogin = async (ctx, next) => {
  await validate(ctx, next, loginSchema)
}