const express = require('express');
const Item = require('../models/Item');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    const item = await Item.create({ name, description });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;