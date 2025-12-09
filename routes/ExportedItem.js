const express = require("express");
const ExportedItems = require("../models/ExportedItem");
const ImportedItems = require("../models/ImportedItem");
const { Op } = require("sequelize");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { new_item_id, quantity, store_id, exporter } =
      req.body;

    if (!new_item_id || !quantity || !store_id || !exporter)
      return res.status(404).json({ success: false, message: "all is required" });

    // is available for both the record and the store

    const isAvailableItemInStore = await ImportedItems.findOne({
      where: {
        [Op.and]: [
          { store_id },
          {
            new_item_id,
          },
        ],
      },
    });

    if (isAvailableItemInStore) {
      const checkQuantity = isAvailableItemInStore.qoh < quantity;
      if (checkQuantity)
        return res.status(404).json({
          success: false,
          message: "not enough quantity to be exported",
        });
      await ExportedItems.create({
        new_item_id,
        quantity,
        store_id,
        exporter,
        user_id: req.user.id,
      });
    } else {
      return res.status(404).json({

        success: false,
        message: "Item Not Found!",
      });
    }

    await ImportedItems.update(
      {
        qoh: isAvailableItemInStore.qoh - quantity,
      },
      {
        where: {
          id: isAvailableItemInStore.id,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "new item has been exported sucessfully",
      data: [1],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "error in the Created Exported Item",
      error: error.message,
    });
  }
});
router.get("/read", async (_, response) => {
  const ExportedItem = await ExportedItems.findAll({
    include: ["store", "newItem"]
  });

  response.status(200).json({
    success: true,
    message: "list of all the exported items ",
    exportedItem: ExportedItem,
  });
});
router.get("/read/qoh", async (request, response) => {
  const { new_item_id, store_id } = request.query;

  const item = await ImportedItems.findOne({
    where: {
      [Op.and]: [
        { new_item_id }, { store_id }
      ]
    }
  })

  response.status(200).json({
    success: true,
    message: "the selected exported item has been displayed ",
    data: item || 0,
  });
});
router.patch("/update/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const { new_item_id, quantity, store_id, exporter } =
      request.body;

    const exportedItem = await ExportedItems.findByPk(id);

    if (!exportedItem)
      return response.status(404).json({ success: false, message: "item not found" });

    const updatedItem = await ExportedItems.update(
      {
        new_item_id: new_item_id,
        quantity: quantity,
        store_id: store_id,
        exporter: exporter,
        user_id: request.user.id,
      },
      {
        where: { id },
      }
    );
    response.status(200).json({
      success: true,
      message: "an exported Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "error in updated exporteditem",
      error: error.message,
    });
  }
});
router.delete("/delete/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const item = await ExportedItems.findByPk(id);

  if (!item)
    return response.status(404).json({
      success: false,
      message: "item not found",
    });

  const itemDeleted = await ExportedItems.destroy({ where: { id } });

  response.status(200).json({
    success: true,
    message: "an exported item has been deleted successfully",
    data: itemDeleted,
  });
});
module.exports = router;
