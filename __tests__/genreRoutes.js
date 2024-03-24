const request = require('supertest')
const app = require('../app')
const { getTokens } = require('../helpers/testHelpers');

describe('Genres API Operations', () => {
  let token;

  beforeAll(async () => {
    // Obtain tokens
    tokens = await getTokens();
    adminToken = tokens.exampleAdminToken;
    userToken = tokens.exampleUserToken;
  });

//CREATE GENRE
  describe('POST /genres - Create Genre', () => {
    //Test for creating a new genre
    it('should create a new genre', async () => {
      const res = await request(app.callback())
        .post('/api/v1/genres')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test',
          description: 'A test genre'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('ID');
      const genreId = res.body.ID;
      expect(typeof genreId).toBe("number")

      //Verify the created genre exists in the database using a GET
      const getResponse = await request(app.callback())
        .get(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(getResponse.statusCode).toEqual(200);
      expect(getResponse.body).toHaveProperty('name', 'Test');
      expect(getResponse.body).toHaveProperty('description', 'A test genre');
    });
    //Test for duplicate genre
    it('should return 500 if genre already exists', async () => {
      const res = await request(app.callback())
        .post('/api/v1/genres')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test',
          description: 'A test genre'
        });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to add the genre');
    });
    //Test for invalid token
    it('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const res = await request(app.callback())
        .post('/api/v1/genres')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test',
          description: 'A test genre'
        }
      );
      expect(res.statusCode).toEqual(403);
    });
  });

  //GET ALL GENRES
  describe('GET /genres - Get All Genres', () => {
    //Test for getting all genres
    it('should get all genres', async () => {
      const res = await request(app.callback())
        .get('/api/v1/genres')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //GET GENRE BY ID
  describe('GET /genres/:id - Get Genre By ID', () => {
    //Test for getting a genre by ID
    it('should get a genre by ID', async () => {
      const genreId = 1; 
      const res = await request(app.callback())
        .get(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('description');
    });
    //Test for no genre found
    it ('should return 404 if genre is not found', async () => {
      const genreId = 100; // Use a non-existing genre ID
      const res = await request(app.callback())
        .get(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(404);
    });
  });

  //UPDATE GENRE
  describe('PUT /genres/:id - Update Genre', () => {
    //Test for updating a genre
    it('should update a genre', async () => {
      const genreId = 4; 
      const res = await request(app.callback())
        .put(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated',
          description: 'Updated Description'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Update successful');
    });
    //Test for no genre found
    it ('should return 400 if genre is not found', async () => {
      const genreId = 100; 
      const res = await request(app.callback())
        .put(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated',
          description: 'Updated Description'
        });
      expect(res.statusCode).toEqual(400);
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const genreId = 4; 
      const res = await request(app.callback())
        .put(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated',
          description: 'Updated Description'
        });
      expect(res.statusCode).toEqual(403);
    });
  });

  //DELETE GENRE
  describe('DELETE /genres/:id - Delete Genre', () => {
    //Test for deleting a genre
    it('should delete a genre', async () => {
      const genreId = 4; 
      const res = await request(app.callback())
        .del(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
    //Test for no genre found
    it ('should return 400 if genre is not found', async () => {
      const genreId = 100; 
      const res = await request(app.callback())
        .del(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(400);
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const genreId = 4; 
      const res = await request(app.callback())
        .del(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });
});