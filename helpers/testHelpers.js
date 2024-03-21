const request = require('supertest');
const app = require('../app'); 

async function loginUser() {
  const response = await request(app.callback())
    .post('/api/v1/login')
    .send({
      username: 'alice123',
      password: 'hashed_password'
    });
  
  return response;
}

module.exports = {
  loginUser
};
