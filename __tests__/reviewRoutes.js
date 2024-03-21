const request = require('supertest')
const app = require('../app')
const { loginUser } = require('../helpers/testHelpers');

describe('Reviews API Operations', () => {
  let token, authorId;

  beforeAll(async () => {
    const loginResponse = await loginUser(); 
    token = loginResponse.body.accessToken;
  });
    
  //CREATE REVIEW
  describe('POST /reviews - Create Review', () => {
    let token;

    beforeAll(async () => {
      const loginResponse = await loginUser(); 
      token = loginResponse.body.accessToken; 
    });

    it('should create a new review', async () => {
      const res = await request(app.callback())
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          book_id: 2, 
          user_id: 1, 
          comment: "Test comment"
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('ID');
    });
  });

  //GET ALL REVIEWS
  describe('GET /reviews - Get All Reviews', () => {
    it('should get all reviews', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken; 

      const res = await request(app.callback())
        .get('/api/v1/reviews')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //GET REVIEW BY ID
  describe('GET /reviews/:id - Get Reviews By Book ID', () => {
    it('should get reviews by book ID', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken; 
      
      const bookId = 2; // Use an existing book ID
      const res = await request(app.callback())
        .get(`/api/v1/reviews/${bookId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //UPDATE REVIEW
  describe('PUT /reviews/:id - Update Review', () => {
    it('should update a review', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken; 

      const reviewId = 5; 
      const res = await request(app.callback())
        .put(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          comment: "Test comment"
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Update successful');
    });
  });

  //DELETE REVIEW
  describe('DELETE /reviews/:id - Delete Review', () => {
    it('should delete a review', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken;

      const reviewId = 4; 
      const res = await request(app.callback())
        .del(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
  });
});
