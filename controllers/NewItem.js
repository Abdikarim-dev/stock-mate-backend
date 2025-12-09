const NewItem = require("../models/NewItem");

// CREATE NEW ITEM
const createNewItem = async (request, response) => {
  const { item_name, item_category } = request.body;

  if (!item_name || !item_category)
    return response
      .status(404)
      .json({ success: false, message: "ITEM NAME AND CATEGORY MUST BE AVAILABLE!" });

  const newItem = await NewItem.create({
    item_name,
    item_category,
  });

  response.status(201).json({
    success: true,
    message: "New Item Created Successfully!",
    data: newItem,
  });
};

const readNewItems = async (_, response) => {
  const newItems = await NewItem.findAll();

  response.status(200).json({
    success: true,
    message: "New items has been fetched successfully",
    newItems: newItems,
  });
};

const readOneNewItem = async (request, response) => {
  const id = parseInt(request.params.id);

  const newItem = await NewItem.findByPk(id);

  if (!newItem) return response.status(404).json({ success: false, message: "Item Not Found" });

  response.status(200).json({
    success: true,
    message: "Item has been fetched successfully",
    data: newItem,
  });
};

const updateOneNewItem = async (request, response) => {
  const id = parseInt(request.params.id);

  const { item_name, item_category } = request.body;

  const item = await NewItem.findByPk(id);

  if (!item)
    return response.status(404).json({ success: false, message: "ITEM MUST BE AVAILABLE" });

  //   if (item_category || item_name)
  //     return response
  //       .status(404)
  //       .json({ message: "ITEM NAME OR CATEGORY MUST BE AVAILABLE" });

  const updatedItem = await NewItem.update(
    {
      item_name: item_name ? item_name : item.item_name,
      item_category: item_category ? item_category : item.item_category,
    },
    {
      where: {
        id,
      },
    }
  );
  response.status(200).json({
    success: true,
    message: "Item Has been updated successfully",
    data: updatedItem,
  });
};

const deleteOneNewItem = async (request, response) => {
  const id = parseInt(request.params.id);

  const item = await NewItem.findByPk(id);

  if (!item) return response.status(404).json({ success: false, message: "Item Not Found" });

  const itemToBeDeleted = await item.destroy();

  response.status(200).json({
    success: true,
    message: "Item Has Been Deleted",
    data: itemToBeDeleted,
  });
};

module.exports = {
  createNewItem,
  readNewItems,
  readOneNewItem,
  updateOneNewItem,
  deleteOneNewItem,
};
