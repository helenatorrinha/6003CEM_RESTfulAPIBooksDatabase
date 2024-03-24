
const request = require('supertest')
const app = require('../app')
const { getTokens } = require('../helpers/testHelpers');

describe('Users API Operations', () => {
  let tokens;

  beforeAll(async () => {
    // Obtain tokens
    tokens = await getTokens();
    adminToken = tokens.exampleAdminToken;
    userToken = tokens.exampleUserToken;
  });

  //CREATE USER
  describe('Post new user', () => {

    //Test for creating a new user
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
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getResponse.statusCode).toEqual(200);
      expect(getResponse.body).toHaveProperty('firstName', 'testName');
      expect(getResponse.body).toHaveProperty('lastName', 'testLastName');
      expect(getResponse.body).toHaveProperty('username', 'test123');
      expect(getResponse.body).toHaveProperty('email', 'test@example.com');
      expect(getResponse.body).toHaveProperty('avatarURL', 'https://cdn-icons-png.flaticon.com/512/2916/2916315.png');
    });
    //Test for duplicate user
    it('should return 500 if user already exists', async () => {
      const res = await request(app.callback())
        .post('/api/v1/users')
        .send({
          firstName: 'Alice',
          lastName: 'Johnson',
          username: 'alice123',
          password: 'password',
          email: ' alice@example.com',
          avatarURL: 'https://cdn-icons-png.flaticon.com/512/2916/2916315.png'
        })
      expect(res.statusCode).toEqual(500)
    });
    //Test for missing required fields
    it ('should return 400 if missing required fields', async () => {
      const res = await request(app.callback())
        .post('/api/v1/users')
        .send({
          firstName: 'testName',
          lastName: 'testLastName',
          email: 'test@example.com',
          avatarURL: 'https://cdn-icons-png.flaticon.com/512/2916/2916315.png'
        })
      expect(res.statusCode).toEqual(400)
    });
  });

  //GET ALL USERS
  describe('Get all users', () => {
    //Test for getting all users
    it('should return all users', async () => {
      const res = await request(app.callback())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const res = await request(app.callback())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
      expect(res.statusCode).toEqual(403)
    } );
  });

  //GET USER BY ID
  describe('Get user by ID', () => {
    //Test for getting a single user
    it('should return a single user', async () => {
      const userId = 1; 
      const res = await request(app.callback())
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user_id', 'firstName', 'lastName','username','email', 'avatarURL', 'role');
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const res = await request(app.callback())
        .get('/api/v1/users/1')
        .set('Authorization', `Bearer ${userToken}`)
      expect(res.statusCode).toEqual(403)
    });
    //Test for user not found
    it ('should return 404 if user is not found', async () => {
      const res = await request(app.callback())
        .get('/api/v1/users/100')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.statusCode).toEqual(404)
    } );
  });

  //UPDATE USER 
  describe('Update user', () => {
    //Test for updating an existing user
    it('should update an existing user', async () => {
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
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Updated Successful');
    });
    //Test for user not found
    it ('should return 400 if user does not exist', async () => {
      const res = await request(app.callback())
        .put('/api/v1/users/100') 
        .send({
          firstName: 'updatedName',
          lastName: 'updatedLastName',
          username: 'updatedUsername',
          email: 'updated@example.com',
          avatarURL: 'https://updatedicon.com/512/2916/2916315.png'
        })
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(400)
    } );
    //Test for unauthorized user
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const res = await request(app.callback())
        .put('/api/v1/users/1')
        .send({
          firstName: 'updatedName',
          lastName: 'updatedLastName',
          username: 'updatedUsername',
          email: 'updated@example.com',
          avatarURL: 'https://updatedicon.com/512/2916/2916315.png'
        })
        .set('Authorization', `Bearer ${userToken}`)
      expect(res.statusCode).toEqual(403)
    });
  });

  //DELETE USER
  describe('Delete user', () => {
    //Test for deleting an existing user
    it('should delete an existing user', async () => {
      const userId = 2; 
      const res = await request(app.callback())
        .del(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
    it ('should return 400 if user does not exist', async () => {
      const res = await request(app.callback())
        .del('/api/v1/users/100')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(400)
    } );
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const res = await request(app.callback())
        .del('/api/v1/users/1')
        .set('Authorization', `Bearer ${userToken}`)
      expect(res.statusCode).toEqual(403)
    } );
  });
});







