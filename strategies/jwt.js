const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('../models/users'); 
const config = require('../config');
const JWT_SECRET_KEY = config.jwtSecret 

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY,
};

/** checkJwt function called from auth to check jwt
 * @async
 * @param {Object} jwtPayload - The jwtPayload object
 * @param {function} done - The callback function
 * @returns {Promise<void>} - A promise that resolves to the user if the jwtPayload is correct, otherwise false
*/
const checkJwt = async (jwtPayload, done) => {
  try {
    console.log("jwtpayload");
    console.log(jwtPayload);
      const [user] = await users.findByUsername(jwtPayload.username);

      if (!user || user.length === 0) {
          console.log(`No user found with username ${jwtPayload.username}`); // not found
          return done(null, false);
      }
      console.log(`Successfully authenticated user ${jwtPayload.username}`); // success
      return done(null, user); // returns user to ctx, allows author id to be added to article
  } catch (error) {
      console.error(`Error during authentication for user ${jwtPayload.username}`); // error
      return done(error);
  }
}

const strategy = new JwtStrategy(options, checkJwt);
module.exports = strategy;

