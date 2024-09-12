const express = require('express');
const { createItem, getItemById, updateItemById, deleteItemById } = require('../controllers/itemController');

const router = express.Router();

router.post('/', createItem);
router.get('/:id', getItemById);

module.exports = router;
