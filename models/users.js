const db = require('../helpers/database');

// Gets all the users in the database
exports.getAll = async function getAll () {
  let query = "SELECT * FROM users;";
  let data = await db.run_query(query);
  return data;
}

// Gets a single user by its id  
exports.getById = async function getById (id) {
  let query = "SELECT * FROM users WHERE user_id = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

// Adds a new user in the database
exports.add = async function add (user) {
  let query = "INSERT INTO users SET ?";
  let data = await db.run_query(query, user);
  return data;
}

// Updates an user in the database
exports.update = async function update (user, id) {
  let query = "UPDATE users SET ? WHERE user_id = ?;";
  let data = await db.run_query(query, [user, id]);
  return data;
}

// Deletes a user in the database
exports.delete = async function deleteUser (id) {
  let query = "DELETE FROM users WHERE user_id = ?;";
  let data = await db.run_query(query, id);
  return data;
}

  