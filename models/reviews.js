/** This module contains functions for interacting with the authors table in the database.
 * @module models/reviews
 * @requires helpers/database
 * @see routes/reviews for the route handlers that use these functions
 * @see schemas/review.json for the JSON Schema definition file
 * @see controllers/validation for the validation functions
 * @see controllers/auth for the authentication middleware
 * @see permissions/reviews for the permissions functions
 */

const db = require('../helpers/database');

/** Gets all the reviews in the database
 * @async
 * @returns {Promise<Array>} A promise to the reviews
 * @throws {Error} Throws an error if the query fails
 */
exports.getAll = async function getAll () {
    let query = "SELECT * FROM reviews;";
    let data = await db.run_query(query);
    return data;
}

/** Gets all the reviews for a book using its id
 * @async
 * @param {number} id - The id of the book to retrieve the reviews
 * @returns {Promise<Array>} A promise to the reviews
 * @throws {Error} Throws an error if the query fails
 */
exports.getReviewsByBookId = async function getReviewsByBookId (id) {
    let query = "SELECT reviews.* FROM reviews JOIN users ON reviews.user_id = users.user_id WHERE reviews.book_id = ? ";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

/** Adds a new review in the database
 * @async
 * @param {Object} review - The review object
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.add = async function add (review) {
  let query = "INSERT INTO reviews SET ?";
  let data = await db.run_query(query, review);
  return data;
}

/** Updates a review in the database
 * @async
 * @param {Object} review - The review object
 * @param {number} id - The id of the review to update
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.update = async function update (review, id) {
  let query = "UPDATE reviews SET ? WHERE review_id = ?;";
  let data = await db.run_query(query, [review, id]);
  return data;
}

/** Deletes a review in the database
 * @async
 * @param {number} id - The id of the review to delete
 * @returns {Promise<number>} A promise to the number of affected rows
 * @throws {Error} Throws an error if the query fails
 */
exports.delete = async function deleteReview (id) {
  let query = "DELETE FROM reviews WHERE review_id = ?;";
  let data = await db.run_query(query, id);
  return data;
}

/** Gets the owner of a review
 * @async
 * @param {number} id - The id of the review to retrieve the owner
 * @returns {Promise<Array>} A promise to the user_id
 * @throws {Error} Throws an error if the query fails
 */
exports.getReviewById = async function getReviewOwner (id) {
  let query = "SELECT user_id FROM reviews WHERE review_id = ?;";
  let data = await db.run_query(query, id);
  return data[0];
}
