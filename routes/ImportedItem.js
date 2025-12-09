const express = require("express");
const { Op } = require("sequelize");
const ImportedItems = require("../models/ImportedItem");

const router = express.Router();
// route for create
router.post("/create", async (request, response) => {
  const { new_item_id, qoh, store_id, importer } = request.body;



  if (!new_item_id || !qoh || !store_id || !importer)
    return response.status(404).json({ success: false, message: "fill every input " });

  // search for match in both item-name and store-name
  const matchItemAndStore = await ImportedItems.findOne({
    where: {
      [Op.and]: [{ new_item_id }, { store_id }],
    },
  });

  if (matchItemAndStore) {
    await ImportedItems.update(
      {
        qoh: matchItemAndStore.qoh + qoh,
        importer,
      },
      {
        where: {
          id: matchItemAndStore.id,
        },
      }
    );
  } else {
    await ImportedItems.create({
      new_item_id,
      qoh,
      store_id,
      importer,
      user_id: request.user.id,
    });
  }

  response.status(201).json({
    success: true,
    message: "a new item has been imported successfully",
    data: [1],
  });
});
// route to get all
router.get("/read", async (_, response) => {
  const importedItems = await ImportedItems.findAll({
    include: ["store", "newItem"]
  });

  response.status(200).json({
    success: true,
    message: "list of all the imported items ",
    importedItems,
  });
});
// route to find one by id
router.get("/read/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const importedItem = await ImportedItems.findByPk(id);

  if (!importedItem)
    return response.status(404).json({ message: "importItem not found" });

  response.status(200).json({
    success: true,
    message: "the selected imported item has been displayed ",
    data: importedItem,
  });
});
router.patch("/update/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const { new_item_id, qoh, store_id, importer, user_id } =
      request.body;

    const importedItem = await ImportedItems.findByPk(id);

    if (!importedItem)
      return response.status(404).json({ success: false, message: "item not found" });

    const updatedItem = await ImportedItems.update(
      {
        new_item_id: new_item_id,
        qoh: qoh,
        store_id: store_id,
        importer: importer,
        user_id: user_id,
      },
      {
        where: { id },
      }
    );
    response.status(200).json({
      success: true,
      message: "an imported Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "error in updated importeditem",
      error: error.message,
    });
  }
});
router.delete("/delete/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const item = await ImportedItems.findByPk(id);

  if (!item)
    return response.status(404).json({
      message: "item not found",
    });

  const itemDeleted = await ImportedItems.destroy({ where: { id } });

  response.status(200).json({
    success: true,
    message: "an imported item has been deleted successfully",
    data: itemDeleted,
  });
});
module.exports = router;
