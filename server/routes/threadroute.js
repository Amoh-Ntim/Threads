const Threadmodel = require('../models/threadmodel');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images');
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
    const imageUrl = image; // Use savedItem._id
    savedItem.image.url = imageUrl;
    await savedItem.save();

    res.status(201).json(savedItem);
  } catch (err) {
    // ... error handling
  }
});




// Read
router.get('/threads', async (req, res) => {
  try {
    const posts = await Threadmodel.find(); // Retrieve all posts
    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      post: post.post,
      imageUrl: post.image.url, // Assuming image.url stores the image URL
    }));
    res.json(formattedPosts);
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
