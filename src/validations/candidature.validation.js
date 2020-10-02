const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createCandidature = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

const getCandidature = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

const getCandidaturesForUser = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};


module.exports = {
  createCandidature,
  getCandidature,
  getCandidaturesForUser,
  updatePost,
  deletePost,
};
