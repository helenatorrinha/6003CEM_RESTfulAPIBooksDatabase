/** 
 * @module routes/special
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires controllers/auth
 * @requires models/users
 * @requires jsonwebtoken
 * @requires bcrypt
 * @requires config
*/

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const auth = require('../controllers/auth');
const router = Router({prefix: '/api/v1'});
const model = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

// Import validation function
const { validateLogin } = require('../controllers/validation');

router.get('/', publicAPI);
router.get('/private', auth, privateAPI);
router.get('/login', bodyParser(), validateLogin, login);

/** Function to return a public message
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the public message
 */
function publicAPI(ctx) {  
  ctx.body = {message: 'PUBLIC PAGE: You requested a new message URI (root) of the API'}
}

/** Function to return a private message
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the private message
 */
function privateAPI(ctx) {
  const user = ctx.state.user;
  ctx.body = {message: `Hello ${user.username} you registered on ${user.dateRegistered}`} 
}

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

async function login(ctx) {
  const loginDetails = ctx.request.body;
  console.log(loginDetails);
  try {
    const [user] = await model.findUserByUsername(loginDetails.username); // Get the user from the model
    // Check if user exists and verifies if the password is correct
    if (!user || user.length === 0 || !(await verifyPassword(user, loginDetails.password))) {
      ctx.status = 401; // Unauthorized
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    // If the user exists and the password is correct, create a JWT token
    const accessToken = jwt.sign({ user_id: user.user_id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });
    ctx.body = { accessToken }; // Return the token
    ctx.status = 200; // OK
  } 
  catch (error) {
    console.error('Error during login:', error);
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Internal server error' };
  }
}

module.exports = router;
