const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const candidatureSchema = mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    cv: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
candidatureSchema.plugin(toJSON);
candidatureSchema.plugin(paginate);

candidatureSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef Candidature
 */
const candidature = mongoose.model('Candidature', candidatureSchema);

module.exports = candidature;
