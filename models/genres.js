const db = require('../helpers/database');

// Gets all the genres in the database
exports.getAll = async function getAll () {
  let query = "SELECT * FROM genres;";
  let data = await db.run_query(query);
  return data;
}

// Gets a single genre by its id  
exports.getById = async function getById (id) {
  let query = "SELECT * FROM genres WHERE genre_id = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

// Adds a new genre in the database
exports.add = async function add (genre) {
  let query = "INSERT INTO genres SET ?";
  let data = await db.run_query(query, genre);
  return data;
}

// Updates a genre in the database
exports.update = async function update (genre, id) {
  let query = "UPDATE genres SET ? WHERE genre_id = ?;";
  let data = await db.run_query(query, [genre, id]);
  return data.affectedRows;
}

// Deletes a genre in the database
exports.delete = async function deleteGenre (id) {
  let query = "DELETE FROM genres WHERE genre_id = ?;";
  let data = await db.run_query(query, id);
  return data.affectedRows;
}

  