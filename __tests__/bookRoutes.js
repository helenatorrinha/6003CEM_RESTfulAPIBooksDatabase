const request = require('supertest')
const app = require('../app')
const { loginUser } = require('../helpers/testHelpers');

describe('Books API Operations', () => {
  let token, authorId;

  beforeAll(async () => {
    const loginResponse = await loginUser(); 
    token = loginResponse.body.accessToken;
  });

  //CREATE  BOOK
  describe('POST /books - Create Book', () => {

    it('should create a new book', async () => {
      const res = await request(app.callback())
        .post('/api/v1/books')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`);
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
  });

  //GET ALL BOOKS
  describe('GET /books - Get All Books', () => {
    it('should get all books', async () => {
      const loginResponse = await loginUser(); 
      const token = loginResponse.body.accessToken; 

      const res = await request(app.callback())
        .get('/api/v1/books')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //GET BOOK BY ID
  describe('GET /books/:id - Get Book By ID', () => {
    it('should get a book by ID', async () => {
      const loginResponse = await loginUser();
      const token = loginResponse.body.accessToken;

      const bookId = 3; 
      const res = await request(app.callback())
        .get(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('title', 'firstname', 'lastname', 'genre', 'publicationDate','description', 'ISBN', 'imageURL');
    });
  });

  //UPDATE BOOK 
  describe('PUT /books/:id - Update Book', () => {
    it('should update a book', async () => {
      const loginResponse = await loginUser();
      const token = loginResponse.body.accessToken;

      const bookId = 3; 
      const res = await request(app.callback())
        .put(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
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
  });

  //DELETE BOOK
  describe('DELETE /books/:id - Delete Book', () => {
    it('should delete a book', async () => {
      const loginResponse = await loginUser();
      const token = loginResponse.body.accessToken;

      const bookId = 3; 
      const res = await request(app.callback())
        .del(`/api/v1/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);

      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
  });
});