
const request = require('supertest')
const app = require('../app')
const { loginUser } = require('../helpers/testHelpers');

//CREATE USER
describe('Post new user', () => {
  let token;

  beforeAll(async () => {
    const loginResponse = await loginUser(); 
    token = loginResponse.body.accessToken; 
  });

  it('should create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'testName',
        lastName: 'testLastName',
        username: 'test123',
        password: 'password',
        email: 'test@example.com',
        avatarURL: 'https://cdn-icons-png.flaticon.com/512/2916/2916315.png'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('ID')

    const userId = res.body.ID;
    expect(typeof userId).toBe("number")
    
    //Verify the created user exists in the database using a GET
    const getResponse = await request(app.callback())
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.statusCode).toEqual(200);
    expect(getResponse.body).toHaveProperty('firstName', 'testName');
    expect(getResponse.body).toHaveProperty('lastName', 'testLastName');
    expect(getResponse.body).toHaveProperty('username', 'test123');
    expect(getResponse.body).toHaveProperty('email', 'test@example.com');
    expect(getResponse.body).toHaveProperty('avatarURL', 'https://cdn-icons-png.flaticon.com/512/2916/2916315.png');
  });
});

//GET ALL USERS
describe('Get all users', () => {
  it('should return all users', async () => {
    const loginResponse = await loginUser(); 
    const token = loginResponse.body.accessToken; 

    const res = await request(app.callback())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

//GET USER BY ID
describe('Get user by ID', () => {
  it('should return a single user', async () => {
    const loginResponse = await loginUser();
    const token = loginResponse.body.accessToken;

    const userId = 1; 
    const res = await request(app.callback())
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user_id', 'firstName', 'lastName','username','email', 'avatarURL', 'role');
  });
});

//UPDATE USER 
describe('Update user', () => {
  it('should update an existing user', async () => {
    const loginResponse = await loginUser();
    const token = loginResponse.body.accessToken;

    const userId = 2; 

    const res = await request(app.callback())
      .put(`/api/v1/users/${userId}`)
      .send({
        firstName: 'updatedName',
        lastName: 'updatedLastName',
        username: 'updatedUsername',
        email: 'updated@example.com',
        avatarURL: 'https://updatedicon.com/512/2916/2916315.png'
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Updated Successful');
  });
});

//DELETE USER
describe('Delete user', () => {
  it('should delete an existing user', async () => {
    const loginResponse = await loginUser();
    const token = loginResponse.body.accessToken;

    const userId = 2; // Replace with an actual user ID that can be deleted

    const res = await request(app.callback())
      .del(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Delete successful');
  });
});





