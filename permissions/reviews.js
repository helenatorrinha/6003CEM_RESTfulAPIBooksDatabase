/**
 * @module permissions/reviews
 * @description Configures authorisation rules using the role-acl library, defining roles and their permissions for the reviews model.
 * @requires role-acl
 * @see routes/reviews for the route handlers that use these functions
 * @see schemas/review.json for the JSON Schema definition file
 * @see controllers/validation for the validation functions
 * @see controllers/auth for the authentication middleware
 * @see models/reviews for the database functions
 */

const AccessControl = require('role-acl');
const ac = new AccessControl(); // Create a new instance of the AccessControl class

/** User Permissions
 * Grants 'user' role permissions to create, update and delete reviews.
 * Allows actions: 'create', 'update', 'delete'.
 * Denies actions: none.
 * In this case, we are excluding the review_id field from the update permission check.
 * Also adding a condition to the update and delete permissions to check if the requester is the owner of the review.
 */
ac.grant('user').execute('create').on('review'); // User can create a review
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
  .on('review', ['comment']); // User can update its 'comment'
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('review'); // User can delete its reviews

/** Admin permissions
 * Grants 'admin' role permissions to create, update and delete reviews.
 * Allows actions: 'create', 'update', 'delete'.
 * Denies actions: none.
 * In this case, we are excluding the review_id field from the update permission check.
 * Also adding a condition to the update permissions to check if the requester is the owner of the review.
 */
ac.grant('admin').execute('create').on('review'); // User can create a review
ac.grant('admin').condition({Fn:'EQUALS', args:
{'requester':'$.owner'}}).execute('update').on('review', ['comment']); // Admin can update its 'comment'
ac.grant('admin').execute('delete').on('review'); // Admin can delete any review

/** Checks the users permission to create a new review
 * @function create
 * @param {Object} requester - The user object
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to create a new review
 */
exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('review');

/** Checks the users permission to update a review
 * @function update
 * @param {Object} requester - The user object
 * @param {number} id - The id of the review to update
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to update the review
 */
exports.update = (requester, id) =>
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('update').sync().on('review');

/** Checks the users permission to delete a review
 * @function delete
 * @param {Object} requester - The user object
 * @param {number} id - The id of the review to delete
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to delete the review
 */
exports.delete = (requester, id) => 
  ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('delete').sync().on('review');
