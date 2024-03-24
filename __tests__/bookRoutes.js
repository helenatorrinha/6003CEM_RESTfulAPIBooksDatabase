const request = require('supertest')
const app = require('../app')
const { getTokens } = require('../helpers/testHelpers');

describe('Books API Operations', () => {
  let token;

  beforeAll(async () => {
    // Obtain tokens
    tokens = await getTokens();
    adminToken = tokens.exampleAdminToken;
    userToken = tokens.exampleUserToken;
  });

  //CREATE  BOOK
  describe('POST /books - Create Book', () => {
    //Test for creating a new book
    it('should create a new book', async () => {
      const res = await request(app.callback())
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: "Test Book",
          firstname: "John",
          lastname: "Doe",
          genre: "Poetry",
          publicationDate: "2024-03-04",
          description: "A test book",
          ISBN: 6780439023528,
          imageURL: "https://example.com/example.jpg"
        });

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('ID')
      const bookId = res.body.ID;
      expect(typeof bookId).toBe("number")
      
      //Verify the created book exists in the database using a GET
      const getResponse = await request(app.callback())
        .get(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(getResponse.statusCode).toEqual(200);
      expect(getResponse.body).toHaveProperty('title', 'Test Book');
      expect(getResponse.body).toHaveProperty('author_firstName', 'John');
      expect(getResponse.body).toHaveProperty('author_lastName', 'Doe');
      expect(getResponse.body).toHaveProperty('genre_name', 'Poetry');
      expect(getResponse.body).toHaveProperty('publicationDate', '2024-03-04');
      expect(getResponse.body).toHaveProperty('description', 'A test book');
      expect(getResponse.body).toHaveProperty('ISBN', '6780439023528');
      expect(getResponse.body).toHaveProperty('imageURL', 'https://example.com/example.jpg');
    });
    //Test for duplicate book
    it('should return 500 if book already exists', async () => {
      const res = await request(app.callback())
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: "Test Book",
          firstname: "John",
          lastname: "Doe",
          genre: "Poetry",
          publicationDate: "2024-03-04",
          description: "A test book",
          ISBN: 6780439023528,
          imageURL: "https://example.com/example.jpg"
        });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to add the book');
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const res = await request(app.callback())
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: "Test Book",
          firstname: "John",
          lastname: "Doe",
          genre: "Poetry",
          publicationDate: "2024-03-04",
          description: "A test book",
          ISBN: 6780439023528,
          imageURL: "https://example.com/example.jpg"
        }
      );
      expect(res.statusCode).toEqual(403);
    });
    //Test for missing required fields
    it ('should return 400 if missing required fields', async () => {
      const res = await request(app.callback())
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: "Test Book",
          firstname: "John",
          lastname: "Doe",
          genre: "Poetry",
          publicationDate: "2024-03-04",
          description: "A test book"
        });
      expect(res.statusCode).toEqual(400);
    } );
  });

  //GET ALL BOOKS
  describe('GET /books - Get All Books', () => {
    //Test for getting all books
    it('should get all books', async () => {
      const res = await request(app.callback())
        .get('/api/v1/books');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //GET BOOK BY ID
  describe('GET /books/:id - Get Book By ID', () => {
    it('should get a book by ID', async () => {
      const bookId = 3; 
      const res = await request(app.callback())
        .get(`/api/v1/books/${bookId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('title', 'firstname', 'lastname', 'genre', 'publicationDate','description', 'ISBN', 'imageURL');
    });
  });

  //UPDATE BOOK 
  describe('PUT /books/:id - Update Book', () => {
    //Test for updating a book
    it('should update a book', async () => {
      const bookId = 3; 
      const res = await request(app.callback())
        .put(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: "Test Book",
          firstname: "Em",
          lastname: "Brown",
          genre: "Poetry",
          publicationDate: "2024-03-04",
          description: "A test book",
          ISBN: 97804390235356,
          imageURL: "https://example.com/example.jpg"
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Update successful');
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const bookId = 3; 
      const res = await request(app.callback())
        .put(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: "Test Book",
          firstname: "Em",
          lastname: "Brown",
          genre: "Poetry",
          publicationDate: "2024-03-04",
          description: "A test book",
          ISBN: 97804390235356,
          imageURL: "https://example.com/example.jpg"
        });
      expect(res.statusCode).toEqual(403);
    });
    //Test for book not found
    it ('should return 400 if book is not found', async () => {
      const bookId = 100; 
      const res = await request(app.callback())
        .put(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: "Test Book",
          firstname: "Em",
          lastname: "Brown",
          genre: "Poetry",
          publicationDate: "2024-03-04",
          description: "A test book",
          ISBN: 97804390235356,
          imageURL: "https://example.com/example.jpg"
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  //DELETE BOOK
  describe('DELETE /books/:id - Delete Book', () => {
    //Test for deleting a book
    it('should delete a book', async () => {
      const bookId = 3; 
      const res = await request(app.callback())
        .del(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);

      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
    //Test for book not found
    it ('should return 400 if book is not found', async () => {
      const bookId = 100;
      const res = await request(app.callback())
        .del(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(400);
    });
    //Test for invalid token
    it ('should return 403 if token is invalid (not authorised/forbidden)', async () => {
      const bookId = 3;
      const res = await request(app.callback())
        .del(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });
});