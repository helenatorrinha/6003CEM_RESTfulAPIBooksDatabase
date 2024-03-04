/** This module contains functions for interacting with the authors table in the database.
 * @module models/genres
 * @requires helpers/database
 * @see routes/genres for the route handlers that use these functions
 * @see schemas/genre.json for the JSON Schema definition file
 * @see controllers/validation for the validation functions
 * @see controllers/auth for the authentication middleware
 * @see permissions/genres for the permissions functions
 */

const db = require('../helpers/database');

/** Gets all the genres in the database
 * @async
 * @returns {Promise<Array>} A promise to the genres
 * @throws {Error} Throws an error if the query fails
 */
exports.getAll = async function getAll () {
  let query = "SELECT * FROM genres;";
  let data = await db.run_query(query);
  return data;
}

/** Gets a single genre by its id 
 * @async
 * @param {number} id - The id of the genre to retrieve
 * @returns {Promise<Array>} A promise to the genre
 * @throws {Error} Throws an error if the query fails
 */
exports.getById = async function getById (id) {
  let query = "SELECT * FROM genres WHERE genre_id = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

/** Adds a new genre in the database
 * @async
 * @param {Object} genre - The genre object
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.add = async function add (genre) {
  let query = "INSERT INTO genres SET ?";
  let data = await db.run_query(query, genre);
  return data;
}

/** Updates a genre in the database
 * @async
 * @param {Object} genre - The genre object
 * @param {number} id - The id of the genre to update
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.update = async function update (genre, id) {
  let query = "UPDATE genres SET ? WHERE genre_id = ?;";
  let data = await db.run_query(query, [genre, id]);
  return data.affectedRows;
}

/** Deletes a genre in the database
 * @async
 * @param {number} id - The id of the genre to delete
 * @returns {Promise<number>} A promise to the number of affected rows
 * @throws {Error} Throws an error if the query fails
 */
exports.delete = async function deleteGenre (id) {
  let query = "DELETE FROM genres WHERE genre_id = ?;";
  let data = await db.run_query(query, id);
  return data.affectedRows;
}

  