//const db = require('../helpers/database');

// Gets all the books in the database
exports.getAll = async function getAll () {
  let query = "SELECT * FROM books;";
  let data = await db.run_query(query);
  return data;
}

// Gets a single book by its id  
exports.getById = async function getById (id) {
  let query = "SELECT * FROM books WHERE ID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

// Adds a new book in the database
exports.add = async function add (book) {
  let query = "INSERT INTO books SET ?";
  let data = await db.run_query(query, book);
  return data;
}

// Updates a book in the database
exports.update = async function update (book, id) {
  let query = "UPDATE books SET ? WHERE ID=?;";
  let data = await db.run_query(query, [book, id]);
  return data;
}

// Deletes a book in the database
exports.delete = async function deleteBook (id) {
  let query = "DELETE FROM books WHERE ID=?;";
  let data = await db.run_query(query, id);
  return data;
}

  