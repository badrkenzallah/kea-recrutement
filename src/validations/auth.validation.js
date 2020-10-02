const _joi = require('@hapi/joi');
const { password } = require('./custom.validation');

const Joi = _joi.extend(require('joi-phone-number'));

const phoneNumberValidation = Joi.string().phoneNumber({ defaultCountry: 'FR', format: 'national' })
.custom(v => v.replace(/\s/g, ''))


const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    phone: phoneNumberValidation.required(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    profession: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    phone: phoneNumberValidation.required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

// const forgotPassword = {
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//   }),
// };

// const resetPassword = {
//   query: Joi.object().keys({
//     token: Joi.string().required(),
//   }),
//   body: Joi.object().keys({
//     password: Joi.string().required().custom(password),
//   }),
// };

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  // forgotPassword,
  // resetPassword,
};
