/** This module contains functions for interacting with the authors table in the database.
 * @module models/books
 * @requires helpers/database
 * @see routes/books for the route handlers that use these functions
 * @see schemas/book.json for the JSON Schema definition file
 * @see controllers/validation for the validation functions
 * @see controllers/auth for the authentication middleware
 * @see permissions/books for the permissions functions
 */

const db = require('../helpers/database');

/** Gets all the books in the database
 * @async
 * @returns {Promise<Array>} A promise to the books
 * @throws {Error} Throws an error if the query fails
 */
exports.getAll = async function getAll () {
  let query = "SELECT book_id, title, books.author_id, firstName as author_firstName, lastName as author_lastName, books.genre_id, name as genre_name, publicationDate, books.description, ISBN, imageURL FROM books, authors, genres where books.author_id = authors.author_id and books.genre_id= genres.genre_id;";
  let data = await db.run_query(query);
  return data;
}


/** Gets a single book by its id  
 * @asyn
 * @param {number} id - The id of the book to retrieve
 * @returns {Promise<Array>} A promise to the book
 * @throws {Error} Throws an error if the query fails
 */
// exports.getById = async function getById (id) {
//   let query = "SELECT book_id, title, books.author_id,  firstName as author_firstName, lastName as author_lastName, books.genre_id, name as genre_name, publicationDate, books.description, ISBN, imageURL FROM books, authors, genres where books.author_id = authors.author_id and books.genre_id= genres.genre_id and books.book_id = ?";
//   let values = [id];
//   let data = await db.run_query(query, values);
//   return data;
// }
exports.getById = async function getById(id) {
  let query = `
    SELECT 
      books.book_id, 
      books.title, 
      authors.firstName AS author_firstName, 
      authors.lastName AS author_lastName, 
      genres.name AS genre_name, 
      books.publicationDate, 
      books.description, 
      books.ISBN, 
      books.imageURL
    FROM books
    JOIN authors ON books.author_id = authors.author_id
    JOIN genres ON books.genre_id = genres.genre_id
    WHERE books.book_id = ?`;

  let values = [id];
  let data = await db.run_query(query, values);
  
  if(data && data.length > 0) {
    const book = data[0];
    if (book.publicationDate) {
      book.publicationDate = book.publicationDate.toISOString ? book.publicationDate.toISOString().split('T')[0] : book.publicationDate.split('T')[0];
    } 
    console.log(book)
    return book;
  } else {
    return null; 
  }
}


/** Adds a new book in the database
 * @asyn
 * @param {Object} book - The book object
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 * @throws {Error} Throws an error if the author or genre is not found
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.add = async function add(book) {
  let authorQuery = "SELECT author_id FROM authors WHERE firstname = ? AND lastname = ?";
  let authorResults = await db.run_query(authorQuery, [book.firstname, book.lastname]);

  let genreQuery = "SELECT genre_id FROM genres WHERE name = ?";
  let genreResults = await db.run_query(genreQuery, [book.genre]);

  // Check if authorResults and genreResults have entries
  if (authorResults.length === 0) {
    return { error: 'Author not found' };
  }
  if (genreResults.length === 0) {
    return { error: 'Genre not found' };
  }

  book.author_id = authorResults[0].author_id;
  book.genre_id = genreResults[0].genre_id;

  delete book.firstname;
  delete book.lastname;
  delete book.genre;

  let query = "INSERT INTO books SET ?";
  let data = await db.run_query(query, book);
  return data;
};

/** Updates a book in the database
 * @asyn
 * @param {Object} book - The book object
 * @param {number} id - The id of the book to update
 * @returns {Promise<ResultSetHeader>} A promise to the result of the query
 * @throws {Error} Throws an error if the query fails
 */
exports.update = async function update (book, id) {
  let query = "UPDATE books SET ? WHERE book_id = ?;";
  let data = await db.run_query(query, [book, id]);
  return data.affectedRows;
}

/** Deletes a book in the database
 * @asyn
 * @param {number} id - The id of the book to delete
 * @returns {Promise<number>} A promise to the number of affected rows
 * @throws {Error} Throws an error if the query fails
 */
exports.delete = async function deleteBook (id) {
  let query = "DELETE FROM books WHERE book_id = ?;";
  let data = await db.run_query(query, id);
  return data.affectedRows;
}

  