/** This module contains functions for interacting with the authors table in the database.
 * @module models/users
 * @requires helpers/database
 * @requires bcrypt
 * @requires saltRounds
 * @see routes/users for the route handlers that use these functions
 * @see schemas/user.json for the JSON Schema definition file
 * @see controllers/validation for the validation functions
 * @see controllers/auth for the authentication middleware
 * @see permissions/users for the permissions functions
 */

const db = require('../helpers/database');
const bcrypt = require ('bcrypt');
const saltRounds = 10;

/** Gets all the users in the database
 * @async
 * @returns {Promise<Array>} A promise to the users
 * @throws {Error} Throws an error if the query fails
 */
exports.getAll = async function getAll () {
  let query = "SELECT * FROM users;";
  let data = await db.run_query(query);
  return data;
}

/** Gets a single user by its id  
 * @async
 * @param {number} id - The id of the user to retrieve
 * @returns {Promise<Array>} A promise to the user
 * @throws {Error} Throws an error if the query fails
 */
exports.getById = async function getById (id) {
  let query = "SELECT * FROM users WHERE user_id = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

/** Adds a new user in the database
 * @async
 * @param {Object} user - The user object
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.add = async function add (user) {
  user.password = await bcrypt.hash(user.password, saltRounds)
  let query = "INSERT INTO users SET ?";
  let data = await db.run_query(query, user);
  return data;
}

/** Updates an user in the database
 * @async
 * @param {Object} user - The user object
 * @param {number} id - The id of the user to update
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.update = async function update (user, id) {
  if (user.password){
    user.password = await bcrypt.hash(user.password, saltRounds)
  }
  
  let query = "UPDATE users SET ? WHERE user_id = ?;";
  let data = await db.run_query(query, [user, id]);
  return data.affectedRows;
}

/** Deletes a user in the database
 * @async
 * @param {number} id - The id of the user to delete
 * @returns {Promise<number>} A promise to the number of affected rows
 * @throws {Error} Throws an error if the query fails
 */
exports.delete = async function deleteUser (id) {
  let query = "DELETE FROM users WHERE user_id = ?;";
  let data = await db.run_query(query, id);
  return data;
}

/** Gets a single user by the (unique) username
 * @async
 * @param {string} username - The username of the user to retrieve
 * @returns {Promise<Array>} A promise to the user
 * @throws {Error} Throws an error if the query fails
 */
exports.findByUsername = async function getByUsername(username) {
  const query = "SELECT * FROM users WHERE username = ?;";
  const user = await db.run_query(query, username);
  return user;
}
  
/** Gets a user given its username
 * @async
 * @param {string} username - The username of the user to retrieve
 * @returns {Promise<Array>} A promise to the user
 * @throws {Error} Throws an error if the query fails
 */
exports.findUserByUsername = async function getByUsername (username) {
  const query = "SELECT * FROM users WHERE username = ?";
  const value = [username];
  const user = await db.run_query(query, value);
  return user;
}  