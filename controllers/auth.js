/** This module configures Koa Passport middleware with the JWT authentication strategy.
 * @module controllers/auth
 * @requires koa-passport
 * @requires strategies/jwt
 */

const passport = require('koa-passport');
const basicAuth = require('../strategies/basic');

/** Use the basic authentication strategy */
passport.use(basicAuth);

/** Export the passport.authenticate middleware */
module.exports = passport.authenticate(['basic'], {session:false});
