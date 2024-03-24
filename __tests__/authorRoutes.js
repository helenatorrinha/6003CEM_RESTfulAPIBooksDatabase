const request = require('supertest');
const app = require('../app');
const { getTokens } = require('../helpers/testHelpers');

describe('Authors API Operations', () => {
  let token;

  beforeAll(async () => {
    // Obtain tokens
    tokens = await getTokens();
    adminToken = tokens.exampleAdminToken;
    userToken = tokens.exampleUserToken;
  });

  //CREATE AUTHOR
  describe('Post new author', () => {
    //Test for creating a new author
    it('should create a new author', async () => {
      const res = await request(app.callback())
        .post('/api/v1/authors')
        .send({
          firstName: 'Firstname',
          lastName: 'Lastname',
          description: 'A test author',
          avatarURL: 'test.png'
        })
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('ID')
      const authorId = res.body.ID;
      expect(typeof authorId).toBe("number")
      
      //Verify the created author exists in the database using a GET
      const getResponse = await request(app.callback())
        .get(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(getResponse.statusCode).toEqual(200);
      expect(getResponse.body).toHaveProperty('firstName', 'Firstname');
      expect(getResponse.body).toHaveProperty('lastName', 'Lastname');
      expect(getResponse.body).toHaveProperty('description', 'A test author');
      expect(getResponse.body).toHaveProperty('avatarURL', 'test.png');
    });
    //Test for duplicate author
    it('should return 500 if author already exists', async () => {
      const res = await request(app.callback())
        .post('/api/v1/authors')
        .send({
          firstName: 'Firstname',
          lastName: 'Lastname',
          description: 'A test author',
          avatarURL: 'test.png'
        })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to add the user');
    });
    //Test for invalid token
    it('should return 401 if token is invalid (not authorised/forbidden)', async () => {
      const res = await request(app.callback())
        .post('/api/v1/authors')
        .send({
          firstName: 'Firstname',
          lastName: 'Lastname',
          description: 'A test author',
          avatarURL: 'test.png'
        }
      );
      expect(res.statusCode).toEqual(401);
    });
  });

  //GET ALL AUTHORS
  describe('GET /authors - Get All Authors', () => {
    //Test for getting all authors
    it('should get all authors', async () => {
      const res = await request(app.callback())
        .get('/api/v1/authors')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //GET AUTHOR BY ID
  describe('GET /authors/:id - Get Author By ID', () => {
    //Test for getting an author by ID
    it('should get an author by ID', async () => {
      const authorId = 1; 
      const res = await request(app.callback())
        .get(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('author_id', 'firstname','lastName','description','avatarURL');
    });
    //Test for author not found
    it ('should return 404 if author is not found', async () => {
      const authorId = 100; 
      const res = await request(app.callback())
        .get(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.statusCode).toEqual(404)
    });
  });

  //UPDATE AUTHOR
  describe('PUT /authors/:id - Update Author', () => {
     //Test for updating an author
    it('should update an author', async () => {
      const authorId = 3; 
      const res = await request(app.callback())
        .put(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          description: 'A test author',
          avatarURL: 'test.png'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Update successful');
    });
    //Test for author not found
    it ('should return 400 if author is not found', async () => {
      const authorId = 100; 
      const res = await request(app.callback())
        .put(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          description: 'A test author',
          avatarURL: 'test.png'
        });
      expect(res.statusCode).toEqual(400);
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const authorId = 3; 
      const res = await request(app.callback())
        .put(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          description: 'A test author',
          avatarURL: 'test.png'
        });
      expect(res.statusCode).toEqual(403);
    });
  });

  //DELETE AUTHOR
  describe('DELETE /authors/:id - Delete Author', () => {
    //Test for deleting an author
    it('should delete an author', async () => {
      const authorId = 1; 
      const res = await request(app.callback())
        .del(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
    //Test for author not found
    it ('should return 400 if author is not found', async () => {
      const authorId = 100; 
      const res = await request(app.callback())
        .del(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(400);
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const res = await request(app.callback())
        .del('/api/v1/authors/1')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });
});
