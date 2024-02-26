const db = require('../helpers/database');

// Gets all the reviews in the database
exports.getAll = async function getAll () {
    let query = "SELECT * FROM reviews;";
    let data = await db.run_query(query);
    return data;
}

// Gets all the reviews for a book using its id
exports.getReviewsByBookId = async function getReviewsByBookId (id) {
    let query = "SELECT reviews.* FROM reviews JOIN users ON reviews.user_id = users.user_id WHERE reviews.book_id = ? ";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// Adds a new review in the database
exports.add = async function add (review) {
  let query = "INSERT INTO reviews SET ?";
  let data = await db.run_query(query, review);
  return data;
}

// Updates a review in the database
exports.update = async function update (review, id) {
  let query = "UPDATE reviews SET ? WHERE review_id = ?;";
  let data = await db.run_query(query, [review, id]);
  return data;
}

// Deletes a review in the database
exports.delete = async function deleteReview (id) {
  let query = "DELETE FROM reviews WHERE review_id = ?;";
  let data = await db.run_query(query, id);
  return data;
}

  