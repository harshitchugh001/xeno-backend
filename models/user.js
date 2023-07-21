const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    userName: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    userEmail: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    
    resetPasswordLink: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

userSchema.virtual('password')
  .set(function (userPassword) {
    this._password = userPassword;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(userPassword);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (userPassword) {
    if (!userPassword) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(userPassword)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};

module.exports = mongoose.model('User', userSchema);
