/** 
 * @module routes/special
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires controllers/auth
*/

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const auth = require('../controllers/auth');
const router = Router({prefix: '/api/v1'});

router.get('/', publicAPI);
router.get('/private', auth, privateAPI);

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

module.exports = router;
