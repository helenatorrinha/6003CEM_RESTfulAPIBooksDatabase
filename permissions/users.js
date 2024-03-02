const AccessControl = require('role-acl');
const ac = new AccessControl();

// User permissions
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('read')
  .on('user', ['*', '!password']); // User can read all his data except the password

ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
  .on('user', ['firstName', 'lastName','username', 'password', 'email', 'avatarURL']); // User can update its 'firstName', 'lastName','username', 'password', 'email', 'avatarURL' (can't update role)

// Admin permissions
ac.grant('admin').execute('read').on('user'); // Admin can read any user
ac.grant('admin').execute('read').on('users'); // Admin can read all users
ac.grant('admin').execute('update').on('user'); // Admin can update any user
ac.grant('admin').condition({Fn:'NOT_EQUALS', args:
{'requester':'$.owner'}}).execute('delete').on('user'); // Admin can delete any user except himself

exports.readAll = (requester) =>
ac.can(requester.role).execute('read').sync().on('users'); 

exports.read = (requester, id) => 
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('read').sync().on('user');

exports.update = (requester, id) =>
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('update').sync().on('user');

exports.delete = (requester, id) =>
  ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('delete').sync().on('user');
