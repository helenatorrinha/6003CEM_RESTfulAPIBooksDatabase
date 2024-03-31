const request = require('supertest');
const app = require('../app');

/**
 * Logs in a user and retrieves their authentication token.
 *
 * @async
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string>} The authentication token of the logged-in user.
 */
async function loginUser(username, password) {
  const response = await request(app.callback())
    .post('/api/v1/login') 
    .send({ username, password });
  return response.body.accessToken;
}

/**
 * Retrieves authentication tokens for admin and regular users using examples.
 *
 * @async
 * @returns {Promise<Object>} An object containing authentication tokens for an example admin and regular user.
 * @property {string} exampleAdminToken - The authentication token for the example admin user.
 * @property {string} exampleUserToken - The authentication token for the example regular user.
 */
async function getTokens() {
 
  // Log in as both users to get their tokens
  const adminToken = await loginUser('alice123', 'hashed_password');
  const userToken = await loginUser('eva789', 'hashed_password');

  return {
    exampleAdminToken: adminToken,
    exampleUserToken: userToken
  };
}

// Export the function to get tokens
module.exports = {
  getTokens
};

