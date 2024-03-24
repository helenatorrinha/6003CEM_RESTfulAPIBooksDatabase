const request = require('supertest');
const app = require('../app');

// Function to log in and get token
async function loginUser(username, password) {
  const response = await request(app.callback())
    .post('/api/v1/login') 
    .send({ username, password });
  
  return response.body.accessToken;
}

// Main function to create users and get their tokens
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

