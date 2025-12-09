const express = require("express");
const Stores = require("../models/Store");

const router = express.Router();

// CREATE A STORE
router.post("/create", async (request, response) => {
  const { store_name, store_location, userId, userRole } = request.body;

  console.log({
    id: userId,
    role: userRole
  })

  const store = await Stores.create({
    store_name: store_name,
    store_location: store_location,
  });

  response.status(201).json({
    success: true,
    message: "Store Has Been Created Successfully!",
    data: store,
  });
});
// GET ALL STORE (CRUD) add,edit,delete,get
router.get("/read", async (_, response) => {
  const stores = await Stores.findAll();

  response.status(200).json({
    success: true,
    message: "Stores has been fetched successfully",
    stores: stores,
  });
});
// GET ONE BY ID
router.get("/read/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const store = await Stores.findByPk(id);

  if (!store) return response.status(404).json({ message: "Store Not Found" });

  response.status(200).json({
    message: "Store has been fetched successfully!",
    data: store,
  });
});
// UPDATE A STORE
router.patch("/update/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const { store_name, store_location } = request.body;

  const store = await Stores.findByPk(id);

  if (!store) return response.status(404).json({ success: false, message: "Store Not Found" });

  const updatingStore = await Stores.update(
    {
      store_name: store_name ? store_name : store.store_name,
      store_location: store_location ? store_location : store.store_location,
    },
    { where: { id } }
  );

  response.status(200).json({
    success: true,
    message: "Store Has Been Updated Successfully!",
    data: updatingStore,
  });
});

// DELETE A STORE 
router.delete("/delete/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  const store = await Stores.findByPk(id)

  if (!store) return response.status(404).json({ success: false, message: "store not found" })

  const deleteStore = await Stores.destroy({ where: { id } })

  response.status(200).json({
    success: true,
    message: "a stores has been deleted successfully",
    data: deleteStore,
  });

});

module.exports = router;
