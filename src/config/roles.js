const roles = ['recruiter', 'applicant'];

const roleRights = new Map();
roleRights.set(roles[1], ['getPosts', 'postuler']);
roleRights.set(roles[0], ['getUsers', 'manageUsers', 'getPosts', 'managePosts', 'manageCandidatures']);

module.exports = {
  roles,
  roleRights,
};
