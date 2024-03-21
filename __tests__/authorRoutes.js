const request = require('supertest');
const app = require('../app');
const { loginUser } = require('../helpers/testHelpers');

describe('Authors API Operations', () => {
  let token, authorId;

  beforeAll(async () => {
    const loginResponse = await loginUser(); 
    token = loginResponse.body.accessToken;
  });

  //CREATE AUTHOR
  describe('Post new author', () => {
    it('should create a new author', async () => {
      const res = await request(app.callback())
        .post('/api/v1/authors')
        .send({
          firstName: 'Firstname',
          lastName: 'Lastname',
          description: 'A test author',
          avatarURL: 'test.png'
        })
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('ID')

      const authorId = res.body.ID;
      expect(typeof authorId).toBe("number")
      
      //Verify the created author exists in the database using a GET
      const getResponse = await request(app.callback())
        .get(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.statusCode).toEqual(200);
      expect(getResponse.body).toHaveProperty('firstName', 'Firstname');
      expect(getResponse.body).toHaveProperty('lastName', 'Lastname');
      expect(getResponse.body).toHaveProperty('description', 'A test author');
      expect(getResponse.body).toHaveProperty('avatarURL', 'test.png');
    });
  });

  //GET ALL AUTHORS
  describe('GET /authors - Get All Authors', () => {
    it('should get all authors', async () => {
      const res = await request(app.callback())
        .get('/api/v1/authors')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  //GET AUTHOR BY ID
  describe('GET /authors/:id - Get Author By ID', () => {
    it('should get an author by ID', async () => {
      const authorId = 1; 
      const res = await request(app.callback())
        .get(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('author_id', 'firstname','lastName','description','avatarURL');
    });
  });

  //UPDATE AUTHOR
  describe('PUT /authors/:id - Update Author', () => {
    it('should update an author', async () => {
      const authorId = 1; 
      const res = await request(app.callback())
        .put(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          description: 'A test author',
          avatarURL: 'test.png'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Update successful');
    });
  });

  //DELETE AUTHOR
  describe('DELETE /authors/:id - Delete Author', () => {
    it('should delete an author', async () => {
      const authorId = 1; 
      const res = await request(app.callback())
        .del(`/api/v1/authors/${authorId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Delete successful');
    });
  });
});
