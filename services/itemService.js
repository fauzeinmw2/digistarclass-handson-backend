const Item = require('../models/Item');

const createItem = async (itemData) => {
  try {
    const item = new Item(itemData);
    const savedItem = await item.save();

    return savedItem;

  } catch (error) {
    console.error('Error creating item :', error);
    throw new Error('Error creating item');
  }
};

const findItemById = async (id) => {
  try {
    const item = await Item.findById(id);

    if (!item) {
      throw new Error('Item not found');
    }

    return item;

  } catch (error) {
    console.error('Error finding item:', error);
    throw new Error('Error finding item');
  }
};

const updateItemById = async (id, itemData) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(id, itemData, { new: true });

    if (!updatedItem) {
      throw new Error('Item not found');
    }

    return updatedItem;

  } catch (error) {
    console.error('Error updating item:', error);
    throw new Error('Error updating item');
  }
};

const deleteItemById = async (id) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      throw new Error('Item not found');
    }
    
    return deletedItem;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw new Error('Error deleting item');
  }
};

module.exports = {
  createItem,
  findItemById,
  updateItemById,
  deleteItemById
};
