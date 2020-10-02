const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createPost = {
  body: Joi.object().keys({
    label: Joi.string().required(),
    description: Joi.string().required(),
    diplome: Joi.string().required(),
    yearsOfExperience: Joi.number().integer().min(1).required(),
    availablePlaces: Joi.number().integer().min(1).required(),
  }),
};

const postuler = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

const getPosts = {
  query: Joi.object().keys({
    yearsOfExperience: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      label: Joi.string(),
      description: Joi.string(),
      diplome: Joi.string(),
      yearsOfExperience: Joi.number().integer().min(1),
      availablePlaces: Joi.number().integer().min(1),
    })
    .min(1),
};

const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPost,
  postuler,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
