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
const model = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

const router = Router({prefix: '/api/v1'}); // Define the route prefix

const { validateLogin } = require('../controllers/validation'); // Import validation function

// Routes
router.get('/', publicAPI);
router.get('/private', auth, privateAPI);
router.post('/login', bodyParser(), validateLogin, login);

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

/** Function to login a user
 * @async
 * @param {object} ctx - The Koa request/response context object
 * @returns {Promise} A promise to the login
 * @throws {Error} Throws an error if the query fails, password is incorrect, or the user does not exist
 */
async function login(ctx) {
  const loginDetails = ctx.request.body; // Get the login details from the request body
  try {
    const [user] = await model.findUserByUsername(loginDetails.username); // Get the user from the model
    if (!user || user.length === 0 || !(await verifyPassword(user, loginDetails.password))) // If the user does not exist or the password is incorrect
    {
      ctx.status = 401; // Unauthorized
      ctx.body = { error: 'Invalid username or password' };
      return;
    }
    // If the user exists and the password is correct, create a JWT token
    const accessToken = jwt.sign({ user_id: user.user_id, username: user.username }, config.jwtSecret, { expiresIn: '1h' }); // Create the token
    const { user_id, username, email, role } = user;
		const links = {
			self: `/users/${user_id}`
		};
		ctx.body = { user_id, username, email, role, accessToken, links };
		ctx.status = 200; // OK

  } 
  catch (error) {
    console.error('Error during login:', error);
    ctx.status = 500; // Internal server error
    ctx.body = { error: 'Internal server error' };
  }
}

module.exports = router;
