const request = require('supertest')
const app = require('../app')
const { loginUser } = require('../helpers/testHelpers');

describe('Genres API Operations', () => {
  let token, authorId;

  beforeAll(async () => {
    const loginResponse = await loginUser(); 
    token = loginResponse.body.accessToken;
  });

  //CREATE  GENRE
  describe('POST /genres - Create Genre', () => {
    let token;

    beforeAll(async () => {
      const loginResponse = await loginUser(); 
      token = loginResponse.body.accessToken; 
    });

    it('should create a new genre', async () => {
      const res = await request(app.callback())
        .post('/api/v1/genres')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.statusCode).toEqual(200);
      expect(getResponse.body).toHaveProperty('name', 'Test');
      expect(getResponse.body).toHaveProperty('description', 'A test genre');
    });
  });

  //GET ALL AUTHORS
  describe('GET /genres - Get All Genres', () => {
    it('should get all genres', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken; 

      const res = await request(app.callback())
        .get('/api/v1/genres')
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //GET GENRE BY ID
  describe('GET /genres/:id - Get Genre By ID', () => {
    it('should get a genre by ID', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken; 

      const genreId = 1; // Use an existing genre ID
      const res = await request(app.callback())
        .get(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('description');
    });
  });

  //UPDATE AUTHOR
  describe('PUT /genres/:id - Update Genre', () => {
    it('should update a genre', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken; 

      const genreId = 5; 
      const res = await request(app.callback())
        .put(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated',
          description: 'Updated Description'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Update successful');
    });
  });

  //DELETE GENRE
  describe('DELETE /genres/:id - Delete Genre', () => {
    it('should delete a genre', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken; 

      const genreId = 5; 
      const res = await request(app.callback())
        .del(`/api/v1/genres/${genreId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
  });
});