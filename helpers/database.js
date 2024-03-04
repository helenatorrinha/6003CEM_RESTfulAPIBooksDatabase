
/** This module contains a utility function to run an SQL query
 * @module helpers/database
 * @see models/* for database query functions
 * @requires promise-mysql
 * @requires config
*/
const mysql = require('promise-mysql');  
const info = require('../config');

/**
 * Runs an SQL query on the database and returns the result.
 * @param {string} query - The SQL query to be executed.
 * @param {Array} values - The values to be used in the query.
 * @returns {Promise<any>} - A promise that resolves to the result of the query.
 * @throws {string} - Throws a generic error if there is a database query error.
 */
exports.run_query = async function run_query(query, values) {
  try {
    const connection = await mysql.createConnection(info.config);
    let data = await connection.query(query, values);
    await connection.end();
    return data;
  } catch (error) {
    // Don't let the actual error propagate up to the response object
    // as it may contain sensitive server information.
    // Instead log it somehow and throw a generic error.
    console.error(error, query, values);
    throw 'Database query error'
  }
}
