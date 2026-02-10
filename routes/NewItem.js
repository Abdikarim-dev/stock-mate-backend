const express = require("express");
const {
  createNewItem,
  readNewItems,
  readOneNewItem,
  updateOneNewItem,
  deleteOneNewItem,
} = require("../controllers/NewItem");
const { authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE NEW ITEM
router.post("/create", authorizeRoles("ADMIN", "STAFF"), createNewItem);
// GET ALL
router.get("/read", authorizeRoles("ADMIN", "STAFF"), readNewItems);

// GET ONE
router.get("/read/:id", authorizeRoles("ADMIN", "STAFF"), readOneNewItem);
// UPDATE
router.patch("/update/:id", authorizeRoles("ADMIN", "STAFF"), updateOneNewItem);
// DELETE
router.delete("/delete/:id", authorizeRoles("ADMIN"), deleteOneNewItem);

module.exports = router;
