const AccessControl = require('role-acl');
const ac = new AccessControl();

//User permissions
ac.grant('user').execute('readNone').on('genre'); 

// Admin permissions
ac.grant('admin').execute('create').on('genre'); 
ac.grant('admin').execute('update').on('genre', ['*', '!genre_id']); 
ac.grant('admin').execute('delete').on('genre'); 

exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('genre');

exports.update = (requester, id) =>
    ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('update').sync().on('genre');

exports.delete = (requester, id) => 
  ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('delete').sync().on('genre');
