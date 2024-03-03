const AccessControl = require('role-acl');
const ac = new AccessControl();

//User permissions
ac.grant('user').execute('readNone').on('book'); 

// Admin permissions
ac.grant('admin').execute('create').on('book'); 
ac.grant('admin').execute('update').on('book', ['*', '!book_id']); 
ac.grant('admin').execute('delete').on('book'); 

exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('book');

exports.update = (requester, id) =>
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('update').sync().on('book');

exports.delete = (requester, id) => 
  ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('delete').sync().on('book');
