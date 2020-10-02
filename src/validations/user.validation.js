const _joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const Joi = _joi.extend(require('joi-phone-number'));

const phoneNumberValidation = Joi.string().phoneNumber({ defaultCountry: 'FR', format: 'national' })
.custom(v => v.replace(/\s/g, ''))


const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    phone: phoneNumberValidation.required(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    profession: Joi.string().required(),
    role: Joi.string().required().valid('recruiter', 'applicant'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      phone: phoneNumberValidation,
      password: Joi.string().custom(password),
      firstName: Joi.string(),
      lastName: Joi.string(),
      profession: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
