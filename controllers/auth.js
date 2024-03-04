/** This module configures Koa Passport middleware with the JWT authentication strategy.
 * @module controllers/auth
 * @requires koa-passport
 * @requires strategies/jwt
 */

const passport = require('koa-passport');
const jwtStrategy = require('../strategies/jwt');

/** Use the jwt authentication strategy */
passport.use(jwtStrategy);

/** Export the passport.authenticate middleware */
module.exports = passport.authenticate(['jwt'], {session:false});


