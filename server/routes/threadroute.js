const Threadmodel = require('../models/threadmodel');
const express = require('express');
const router = express.Router();
const multer = require('multer');

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
router.post('/thread', upload.single('image'), async (req, res) => {
  try {
    const { post } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const item = new Threadmodel({ post, image: imagePath });
    const savedItem = await item.save();

    // Generate image URL here
    const imageUrl = req.protocol + '://' + req.get('host') + '/Images/' + path.basename(imagePath);

    // Include imageUrl in response
    res.status(201).json({ ...savedItem.toJSON(), imageUrl });
  } catch (err) {
    // ...
  }
});


// Read
router.get('/thread', async (req, res) => {
  try {
    const items = await Threadmodel.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
