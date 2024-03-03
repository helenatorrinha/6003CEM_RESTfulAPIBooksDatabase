const AccessControl = require('role-acl');
const ac = new AccessControl();

// User permissions
ac.grant('user').execute('create').on('review'); // User can create a review
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
  .on('review', ['comment']); // User can update its 'comment'
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('review'); // User can delete its reviews

// Admin permissions
ac.grant('admin').execute('create').on('review'); // User can create a review
ac.grant('admin').condition({Fn:'EQUALS', args:
{'requester':'$.owner'}}).execute('update').on('review', ['comment']); // Admin can update its 'comment'
ac.grant('admin').execute('delete').on('review'); // Admin can delete any review

exports.create = (requester) =>
    ac.can(requester.role).execute('create').sync().on('review');

exports.update = (requester, id) =>
ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('update').sync().on('review');

exports.delete = (requester, id) => 
  ac.can(requester.role).context({requester:requester.user_id, owner:id}).execute('delete').sync().on('review');
