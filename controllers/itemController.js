const itemService = require('../services/itemService');

// Controller untuk membuat item baru
const createItem = async (req, res) => {
  try {
    const itemData = req.body;
    const newItem = await itemService.createItem(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item' });
  }
};

// Controller untuk mendapatkan item berdasarkan ID
const getItemById = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await itemService.findItemById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Error finding item:', error);
    res.status(500).json({ message: 'Error finding item' });
  }
};

// Controller untuk memperbarui item berdasarkan ID
const updateItemById = async (req, res) => {
  try {
    const id = req.params.id;
    const itemData = req.body;
    const updatedItem = await itemService.updateItemById(id, itemData);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
};

// Controller untuk menghapus item berdasarkan ID
const deleteItemById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await itemService.deleteItemById(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(deletedItem);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item' });
  }
};

module.exports = {
  createItem,
  getItemById,
  updateItemById,
  deleteItemById
};
