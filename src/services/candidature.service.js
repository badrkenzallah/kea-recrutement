const httpStatus = require('http-status');
const { Candidature } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a candidature
 * @param {Object} candidatureBody
 * @returns {Promise<Candidature>}
 */
const createCandidature = async (candidatureBody) => {
  const candidature = await Candidature.create(candidatureBody);
  return candidature;
};



module.exports = {
  createCandidature
};
