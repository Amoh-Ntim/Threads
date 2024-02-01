const Threadmodel = require('../models/threadmodel');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
var url = require('url');

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}

// Set up multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Create
// ...

router.post('/thread', upload.single('image'), async (req, res) => {
  try {
    const { post } = req.body;

    // Check if an image was provided in the request
      // Store the path to the uploaded file
      const imagePath = req.file.path;


    const item = new Threadmodel({ post, image: imagePath });
    const savedItem = await item.save();

    // Generate and store image URL
    const imageUrl = req.protocol + '://' + req.get('host') + '/Images/' + req.file.filename; // For URL storage
    console.log('Image URL:', imageUrl);
    savedItem.image.url = imageUrl;
    await savedItem.save();

    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to create post. Please try again.' }); // Informative message for the user
  }
});




// Read
router.get('/thread', async (req, res) => {
  try {
    console.log(fullUrl(req));
    const threads = await Threadmodel.find(); // Retrieve all posts
    const formattedThreads = threads.map((thread) => ({
      _id: thread._id,
      post: thread.post,
      imageUrl: thread.image ? thread.image.url : null, // Use thread.image.url if thread.image is not undefined, otherwise use null
    }));
    res.json(formattedThreads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


// Update
router.put('/thread/:id', async (req, res) => {
  try {
    const updatedItem = await Threadmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/thread/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Threadmodel.findByIdAndDelete(id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
