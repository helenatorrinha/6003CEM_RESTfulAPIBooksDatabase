/** This module defines a Passport strategy for basic HTTP authentication.
 * @module strategies/basic
 * @requires passport-http
 * @requires models/users
 * @requires bcrypt
 */

const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/users');
const bcrypt = require('bcrypt')

/** Verify the password for a user
 * @async
 * @param {Object} user - The user object
 * @param {string} password - The password to verify
 * @returns {Promise<boolean>} - A promise that resolves to true if the password is correct, otherwise false
 */
const verifyPassword = async function (user, password) {
  // compare user.password with the password supplied
  return await bcrypt.compare(password, user.password) 
}

/** Check the username and password for a user
 * @async
 * @param {string} username - The username to check
 * @param {string} password - The password to check
 * @param {function} done - The callback function
 * @returns {Promise<void>} - A promise that resolves to the user if the username and password are correct, otherwise false
 */
const checkUserAndPass = async (username, password, done) => {
    // look up the user and check the password if the user exists
    // call done() with either an error or the user, depending on outcome
    let result;
    try {
      result = await users.findByUsername(username);
    } catch (error) {
      console.error(`Error during authentication for user ${username}`);
      return done(error);
    }
  
    if (result.length) {
      const user = result[0]; 
      if (await verifyPassword(user, password)) {
        console.log(`Successfully authenticated user ${username}`);
        return done(null, user);
      } else {
        console.log(`Password incorrect for user ${username}`);
      }
    } else {
      console.log(`No user found with username ${username}`);
    }
    return done(null, false);  // username or password were incorrect
}
  
const strategy = new BasicStrategy(checkUserAndPass);
module.exports = strategy;
  