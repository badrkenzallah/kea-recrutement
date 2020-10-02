const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (await User.isPhoneTaken(userBody.phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
  }

  const user = await User.create(userBody);
  return user;
};

/**
 * Get user by id
 * @param {User} user
 * @param {Object} candidatureId
 * @returns {Promise<User>}
 */
const saveCandidature = async (user, candidatureId) => {
  user.candidatures.push(candidatureId)
  await user.save();

  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by phone
 * @param {string} phone
 * @returns {Promise<User>}
 */
const getUserByPhone = async (phone) => {
  return User.findOne({ phone });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Create default admin user
 * @returns {Promise<User>}
 */
const tryCreateAdmin = async () => {
  const admin = {
    "email": "admin@admin.com",
    "phone": "0611223344",
    "password": "ADMINpass1.",
    "firstName": "Admin",
    "lastName": "admin",
    "profession": "Recruteur",
    "role": "recruiter"
}
  if (await User.isEmailTaken(admin.email)) {
    return;
  }

  if (await User.isPhoneTaken(admin.phone)) {
    return;
  }

  const user = await User.create(admin);
  return user;
};

module.exports = {
  createUser,
  saveCandidature,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUserById,
  deleteUserById,
  tryCreateAdmin
};
