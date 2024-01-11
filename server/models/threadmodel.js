const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
post: {
    type: String,
    required: true,
},image: {
  data: Buffer,
  contentType: String
},

  // Add more fields as needed
});

const Threadmodel= mongoose.model('Thread', itemSchema);
module.exports = Threadmodel;
