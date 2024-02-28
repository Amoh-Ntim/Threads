import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
post: {
    type: String,
    required: true,
},image: {
  url: String, // Store only the image URL
},

  // Add more fields as needed
});

const Threadmodel= mongoose.model('Thread', itemSchema);
export default Threadmodel;
