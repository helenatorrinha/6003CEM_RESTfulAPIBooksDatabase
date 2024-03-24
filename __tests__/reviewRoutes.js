const request = require('supertest')
const app = require('../app')
const { getTokens } = require('../helpers/testHelpers');

describe('Reviews API Operations', () => {
  let token;

  beforeAll(async () => {
    // Obtain tokens
    tokens = await getTokens();
    adminToken = tokens.exampleAdminToken;
    userToken = tokens.exampleUserToken;
  });
    
  //CREATE REVIEW
  describe('POST /reviews - Create Review', () => {
    //Test for creating a new review
    it('should create a new review', async () => {
      const res = await request(app.callback())
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          book_id: 2, 
          user_id: 1, 
          comment: "Test comment"
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('ID');
    });
    //Test for invalid token
    it ('should return 401 if token is invalid', async () => {
      const invalidToken = "12345tgfdewq234r";
      const res = await request(app.callback())
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({
          book_id: 2, 
          user_id: 1, 
          comment: "Test comment"
        }
      );
      expect(res.statusCode).toEqual(401);
    });
  });

  //GET ALL REVIEWS
  describe('GET /reviews - Get All Reviews', () => {
    //Test for getting all reviews
    it('should get all reviews', async () => {
      const res = await request(app.callback())
        .get('/api/v1/reviews')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //GET REVIEW BY BOOK ID
  describe('GET /reviews/:bookid - Get Reviews By Book ID', () => {
    //Test for getting reviews by book ID
    it('should get reviews by book ID', async () => {
      const bookId = 2; 
      const res = await request(app.callback())
        .get(`/api/v1/reviews/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    //Test for no reviews found
    it ('should return 404 if no reviews are found', async () => {
      const bookId = 100; // Use a non-existing book ID
      const res = await request(app.callback())
        .get(`/api/v1/reviews/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(404);
    });
  });

  //UPDATE REVIEW
  describe('PUT /reviews/:id - Update Review', () => {
    //Test for updating a review
    it('should update a review', async () => {
      const reviewId = 1; 
      const res = await request(app.callback())
        .put(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          comment: "Test comment"
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Update successful');
    });
    it ('should return 404 if review is not found', async () => {
      const reviewId = 100; 
      const res = await request(app.callback())
        .put(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          comment: "Test comment"
        });
      expect(res.statusCode).toEqual(404);
    });
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const reviewId = 1; 
      const res = await request(app.callback())
        .put(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          comment: "Test comment"
        });
      expect(res.statusCode).toEqual(403);
    });
  });

  //DELETE REVIEW
  describe('DELETE /reviews/:id - Delete Review', () => {
    //Test for deleting a review
    it('should delete a review', async () => {
      const reviewId = 4; 
      const res = await request(app.callback())
        .del(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
    //Test for no review found
    it ('should return 404 if review is not found', async () => {
      const reviewId = 100; 
      const res = await request(app.callback())
        .del(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(404);
    });
    //Test for invalid token
    it ('should return 401 if token is invalid (not authorised/forbidden)', async () => {
      const invalidToken = "12345tgfdewq234r";
      const reviewId = 1;
      const res = await request(app.callback())
        .del(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${invalidToken}`);
      expect(res.statusCode).toEqual(401);
    });
  });
});
