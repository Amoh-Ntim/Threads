const Threadmodel = require('../models/threadmodel');
const express = require('express');
const router = express.Router();

// Create
router.post('/thread', async (req, res) => {
  try {
    const { post, image } = req.body;
    const item = new Threadmodel({ post, image });
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
