const mongoose = require('mongoose');

const oauthUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  provider: {
    type: String,
    default: 'google'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OAuthUser', oauthUserSchema);