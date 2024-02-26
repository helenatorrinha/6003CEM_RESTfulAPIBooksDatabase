const db = require('../helpers/database');

// Gets all the authors in the database
exports.getAll = async function getAll () {
  let query = "SELECT * FROM authors;";
  let data = await db.run_query(query);
  return data;
}

// Gets a single author by its id  
exports.getById = async function getById (id) {
  let query = "SELECT * FROM authors WHERE author_id = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

// Adds a new author in the database
exports.add = async function add (author) {
  let query = "INSERT INTO authors SET ?";
  let data = await db.run_query(query, author);
  return data;
}

// Updates a author in the database
exports.update = async function update (author, id) {
  let query = "UPDATE authors SET ? WHERE author_id = ?;";
  let data = await db.run_query(query, [author, id]);
  return data;
}

// Deletes a author in the database
exports.delete = async function deleteAuthor (id) {
  let query = "DELETE FROM authors WHERE author_id = ?;";
  let data = await db.run_query(query, id);
  return data;
}

  