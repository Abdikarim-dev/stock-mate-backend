const express = require("express");
const ExportedItems = require("../models/ExportedItem");
const DamagedItems = require("../models/DamagedItem");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { damaged_items_id, quantity, user_id, store_id } =
      req.body;

    if (!damaged_items_id || !quantity || !user_id || !store_id)
      return res.status(404).json({ message: "all is required" });

    const damagedItem = await DamagedItems.create({
      damaged_items_id,
      quantity,
      user_id,
      store_id
    })

    res.status(200).json({
      message: "new item has been exported sucessfully",
      data: damagedItem
    })

  } catch (error) {
    res.status(400).json({
      message: "error in the register damaged Item",
      error: error.message,
    });
  }
});
router.get("/read", async (_, response) => {
  const damagedItem = await DamagedItems.findAll({
    include: ["store", "newItem"]
  });

  response.status(200).json({
    message: "list of all the damaged items ",
    data: damagedItem,
  });
});
router.get("/read/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const damagedItem = await DamagedItems.findByPk(id)

  if (!damagedItem)
    return response.status(404).json({ message: "damaged item not found" });



  response.status(200).json({
    message: "the selected damaged item has been displayed ",
    data: damagedItem,
  });
});
router.patch("/update/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const { damaged_items_id, quantity, user_id, store_id } =
      request.body;

    const damagedItem = await DamagedItems.findByPk(id);

    if (!damagedItem)
      return response.status(404).json({ message: "item not found" });

    const updatedItem = await DamagedItems.update(
      {
        damaged_items_id: damaged_items_id,
        quantity: quantity,
        store_id: store_id,
        user_id: user_id,
      },
      {
        where: { id },
      }
    );
    response.status(200).json({
      message: "a damaged Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    response.status(400).json({
      message: "error in updated damageditem",
      error: error.message,
    });
  }
});
router.delete("/delete/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const item = await DamagedItems.findByPk(id);

  if (!item)
    return response.status(404).json({
      message: "item not found",
    });

  const itemDeleted = await DamagedItems.destroy({ where: { id } })

  response.status(200).json({
    message: "a damaged item has been deleted successfully",
    data: itemDeleted
  })

});
module.exports = router;
