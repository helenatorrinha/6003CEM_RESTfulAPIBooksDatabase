/** This module contains functions for interacting with the authors table in the database.
 * @module models/authors
 * @requires helpers/database
 * @see routes/authors for the route handlers that use these functions
 * @see schemas/author.json for the JSON Schema definition file
 * @see controllers/validation for the validation functions
 * @see controllers/auth for the authentication middleware
 * @see permissions/authors for the permissions functions
 */

const db = require('../helpers/database');

/** Get all authors in the database
 * @async
 * @returns {Promise<Array>} A promise to the authors
 * @throws {Error} Throws an error if the query fails
 */
exports.getAll = async function getAll () {
  let query = "SELECT * FROM authors;";
  let data = await db.run_query(query);
  return data;
}

/** Get a single author by its id  
 * @async
 * @param {number} id - The id of the author to retrieve
 * @returns {Promise<Array>} A promise to the author
 * @throws {Error} Throws an error if the query fails
 */
exports.getById = async function getById (id) {
  let query = "SELECT * FROM authors WHERE author_id = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

/** Adds a new author in the database 
 * @async
 * @param {Object} author - The author object
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.add = async function add (author) {
  let query = "INSERT INTO authors SET ?";
  let data = await db.run_query(query, author);
  return data;
}

/** Updates a author in the database
 * @async
 * @param {Object} author - The author object
 * @param {number} id - The id of the author to update
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.update = async function update (author, id) {
  let query = "UPDATE authors SET ? WHERE author_id = ?;";
  let data = await db.run_query(query, [author, id]);
  return data;
}

/** Deletes a author in the database
 * @async
 * @param {number} id - The id of the author to delete
 * @returns {Promise<number>} A promise to the number of affected rows
 * @throws {Error} Throws an error if the query fails
 */
exports.delete = async function deleteAuthor (id) {
  let query = "DELETE FROM authors WHERE author_id = ?;";
  let data = await db.run_query(query, id);
  return data.affectedRows;
}

  