/**
 * @module strategies/jwt
 * @requires passport-jwt
 * @requires models/users
 * @requires config
 */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('../models/users'); 
const config = require('../config');

/** The options for the jwt strategy */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

/** checkJwt function called from auth to check jwt
 * @async
 * @param {Object} jwtPayload - The jwtPayload object
 * @param {function} done - The callback function
 * @returns {Promise<void>} - A promise that resolves to the user if the jwtPayload is correct, otherwise false
*/
const checkJwt = async (jwtPayload, done) => {
  try {
      const [user] = await users.findByUsername(jwtPayload.username); // find user
      if (!user || user.length === 0) // if no user found
      {
        console.log(`No user found with username ${jwtPayload.username}`); // not found
        return done(null, false);
      }
      console.log(`Successfully authenticated with username ${jwtPayload.username}`);// success
      return done(null, user); // return user
  } catch (error) {
      console.error(`Error during authentication for user ${jwtPayload.username}`); // error
      return done(error);
  }
}

const strategy = new JwtStrategy(options, checkJwt); // create strategy
module.exports = strategy;

