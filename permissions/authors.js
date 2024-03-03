const AccessControl = require('role-acl');
const ac = new AccessControl();

//User permissions
ac.grant('user').execute('readNone').on('author'); 

// Admin permissions
ac.grant('admin').execute('create').on('author'); 
ac.grant('admin').execute('update').on('author', ['*', '!author_id']); 
ac.grant('admin').execute('delete').on('author'); 

exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('author');

exports.update = (requester, id) =>
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('update').sync().on('author');

exports.delete = (requester, id) => 
  ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('delete').sync().on('author');
