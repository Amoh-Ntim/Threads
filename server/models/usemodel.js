const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Trim whitespace
    minlength: 3, // Minimum username length
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum password length
  },
  profilePic: {
    type: String,
    default: null, // Optional, allow storing a URL or path
  },
  
});

module.exports = mongoose.model('User', userSchema);
