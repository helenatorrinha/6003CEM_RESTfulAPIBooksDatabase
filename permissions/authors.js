/**
 * @module permissions/authors
 * @description Configures authorisation rules using the role-acl library, defining roles and their permissions for the authors model.
 * @requires role-acl
 * @see routes/authors for the route handlers that use these functions
 * @see schemas/author.json for the JSON Schema definition file
 * @see controllers/validation for the validation functions
 * @see controllers/auth for the authentication middleware
 * @see models/authors for the database functions
 */

const AccessControl = require('role-acl');
const ac = new AccessControl(); // Create a new instance of the AccessControl class

/** User Permissions
 * Grants 'user' role permissions to readNone authors (no permissions).
 * Allows actions: 'readNone'.
 * Denies actions: 'create', 'update', 'delete'.
 */
ac.grant('user').execute('readNone').on('author'); 

/** Admin Permissions
 * Grants 'admin' role permissions to create, update and delete authors.
 * Allows actions: 'create', 'update', 'delete'.
 * Denies actions: none.
 * In this case, we are excluding the author_id field from the update permission check.
 */
ac.grant('admin').execute('create').on('author'); 
ac.grant('admin').execute('update').on('author', ['*', '!author_id']); 
ac.grant('admin').execute('delete').on('author'); 

/** Checks the users permission to create a new author
 * @function create
 * @param {Object} requester - The user object
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to create a new author
 */
exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('author');

/** Checks the users permission to update an author
 * @function update
 * @param {Object} requester - The user object
 * @param {number} id - The id of the author to update
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to update the author
 */
exports.update = (requester, id) =>
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('update').sync().on('author');

/** Checks the users permission to delete an author
 * @function delete
 * @param {Object} requester - The user object
 * @param {number} id - The id of the author to delete
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to delete the author
 */
exports.delete = (requester, id) => 
  ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('delete').sync().on('author');
