const express = require("express");
const StoreToStoreTransfer = require("../models/StoreToStoreTransfer");
const ImportedItems = require("../models/ImportedItem");
const Stores = require("../models/Store");
const { Op } = require("sequelize");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const {
      transfer_items_id,
      quantity,
      store_from_id,
      store_to_id,
      transferBy,
      user_id,
    } = req.body;

    if (!quantity || !store_from_id || !store_to_id || !transferBy || !user_id)
      return res.status(404).json({ message: "all is required" });
    // check where the item to be transfer is available with its store

    const isFoundItemInStore = await ImportedItems.findOne({
      where: {
        [Op.and]: [{ imported_items_id: transfer_items_id }, { store_id: store_from_id }],
      },
    });
    // item A store 2
    if (isFoundItemInStore) {
      const checkQuantity = isFoundItemInStore.qoh < quantity;
      if (checkQuantity) {
        return res
          .status(404)
          .json({ message: "not enough quantity to be transfered" });
      }

      // store to is it exists

      const isStoreTOExists = await Stores.findOne({
        where: {
          id: store_to_id,
        },
      });

      if (isStoreTOExists) {
        const IsItemExists = await ImportedItems.findOne({
          where: {
            [Op.and]: [
              { store_id: store_to_id },
              { imported_items_id: transfer_items_id },
            ],
          },
        });
        if (IsItemExists) {
          await ImportedItems.update(
            {
              qoh: IsItemExists.qoh + quantity,
            },
            {
              where: {
                id: IsItemExists.id,
              },
            }
          );
          await ImportedItems.update({
            qoh: isFoundItemInStore.qoh - quantity,
          }, {
            where: { id: isFoundItemInStore.id }
          });
        } else {
          await ImportedItems.create({
            imported_items_id: transfer_items_id,
            qoh: quantity,
            store_id: store_to_id,
            importer: transferBy,
            user_id,
          });

          await ImportedItems.update({
            qoh: isFoundItemInStore.qoh - quantity,
          }, {
            where: { id: isFoundItemInStore.id }
          });
        }
      } else {
        return res.status(404).json({ message: store_to_id + " not exists " });
      }

      await StoreToStoreTransfer.create({
        transfer_items_id,
        quantity,
        store_from_id,
        store_to_id,
        transferBy,
        user_id,
      });


      // if (isItemAvailableInStoreTO) {
      //   await ImportedItems.update(
      //     {
      //       qoh: isItemAvailableInStoreTO.qoh + quantity,
      //     },
      //     {
      //       where: {
      //         id: isItemAvailableInStoreTO.id,
      //       },
      //     }
      //   );
      // } else {
      //   await StoreToStoreTransfer.create({
      //     transfer_items_id,
      //     quantity,
      //     store_from_id,
      //     store_to_id,
      //     transferBy,
      //     user_id,
      //   });
      // }

    } else {
      return res.status(404).json({ message: "item not found!" });
    }

    res.status(200).json({
      message: "an  item has been tranfered sucessfully",
      data: 1,
    });
  } catch (error) {
    res.status(400).json({
      message: "error in the tranfer item Item",
      error: error.message,
    });
  }
});
router.get("/read", async (_, response) => {
  const tranferedItem = await StoreToStoreTransfer.findAll();

  response.status(200).json({
    message: "list of all the transfer items ",
    data: tranferedItem,
  });
});
// route to find one by id
router.get("/read/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const tranferedItem = await StoreToStoreTransfer.findByPk(id)

  if (!tranferedItem)
    return response.status(404).json({ message: "tranferItem not found" });



  response.status(200).json({
    message: "the selected transfer item has been displayed ",
    data: tranferedItem,
  });
});
router.patch("/update/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const { transfer_items_id, quantity, store_from_id, store_to_id, transferBy, user_id } =
      request.body;

    const transferItem = await StoreToStoreTransfer.findByPk(id);

    if (!transferItem)
      return response.status(404).json({ message: "item not found" });

    const updatedItem = await StoreToStoreTransfer.update(
      {
        transfer_items_id: transfer_items_id,
        quantity: quantity,
        store_from_id: store_from_id,
        store_to_id: store_to_id,
        transferBy: transferBy,
        user_id: user_id
      },
      {
        where: { id },
      }
    );
    response.status(200).json({
      message: "a transfer Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    response.status(400).json({
      message: "error in updated transfer item",
      error: error.message,
    });
  }
});
router.delete("/delete/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const item = await StoreToStoreTransfer.findByPk(id);

  if (!item)
    return response.status(404).json({
      message: "item not found",
    });

  const itemDeleted = await StoreToStoreTransfer.destroy({ where: { id } })

  response.status(200).json({
    message: "a transfer item has been deleted successfully",
    data: itemDeleted
  })

});

module.exports = router