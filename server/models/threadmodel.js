const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
post: {
    type: String,
    // required: true,
},

  // Add more fields as needed
});

const Threadmodel= mongoose.model('Thread', itemSchema);
module.exports = Threadmodel;
