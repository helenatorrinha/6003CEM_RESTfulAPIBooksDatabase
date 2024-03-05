/**
 * @module permissions/users
 * @description Configures authorisation rules using the role-acl library, defining roles and their permissions for the users model.
 * @requires role-acl
 * @see routes/users for the route handlers that use these functions
 * @see schemas/user.json for the JSON Schema definition file
 * @see controllers/validation for the validation functions
 * @see controllers/auth for the authentication middleware
 * @see models/users for the database functions
 */

const AccessControl = require('role-acl');
const ac = new AccessControl(); // Create a new instance of the AccessControl class

/** User permissions
 * Grants 'user' role permissions to read, update and delete users.
 * Allows actions: 'read', 'update', 'delete'.
 * Denies actions: none.
 * In this case, we are excluding the user_id field from the update permission check.
 * Also adding a condition to the read, update and delete permissions to check if the requester is the user.
*/
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('read')
  .on('user', ['*', '!password', '!role']); // User can read all his data except the password and role
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
  .on('user', ['firstName', 'lastName','username', 'password', 'email', 'avatarURL']); // User can update its 'firstName', 'lastName','username', 'password', 'email', 'avatarURL' (can't update role)

// Admin permissions
/**
 * Grants 'admin' role permissions to read, update and delete users.
 * Allows actions: 'read', 'update', 'delete'.
 * Denies actions: none.
 * In this case, we are excluding the user_id field from the update permission check.
 * Also adding a condition to the delete permission to check if the requester is the user to prevent an admin to delete himself.
 
 */
ac.grant('admin').execute('read').on('user', ['*', '!password']); // Admin can read any user
ac.grant('admin').execute('read').on('users', ['*', '!password']); // Admin can read all users
ac.grant('admin').execute('update').on('user'); // Admin can update any user
ac.grant('admin').condition({Fn:'NOT_EQUALS', args:
{'requester':'$.owner'}}).execute('delete').on('user'); // Admin can delete any user except himself

/** Checks the users permission to read all users
 * @function readAll
 * @param {Object} requester - The user object
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to read all users
 */
exports.readAll = (requester) =>
ac.can(requester.role).execute('read').sync().on('users'); 

/** Checks the users permission to read a user
 * @function read
 * @param {Object} requester - The user object
 * @param {number} id - The id of the user to read
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to read the user
 */
exports.read = (requester, id) => 
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('read').sync().on('user');

/** Checks the users permission to update a user
 * @function update
 * @param {Object} requester - The user object
 * @param {number} id - The id of the user to update
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to update the user
 */
exports.update = (requester, id) =>
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('update').sync().on('user');

/** Checks the users permission to delete a user
 * @function delete
 * @param {Object} requester - The user object
 * @param {number} id - The id of the user to delete
 * @returns {object} - The result of the authorisation check
 * @throws {Error} Throws an error if the user does not have permission to delete the user
 */
exports.delete = (requester, id) =>
  ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('delete').sync().on('user');
