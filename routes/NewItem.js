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
router.post("/create", authorizeRoles("admin", "staff"), createNewItem);
// GET ALL
router.get("/read", authorizeRoles("admin", "staff"), readNewItems);

// GET ONE
router.get("/read/:id", authorizeRoles("admin", "staff"), readOneNewItem);
// UPDATE
router.patch("/update/:id", authorizeRoles("admin", "staff"), updateOneNewItem);
// DELETE
router.delete("/delete/:id", authorizeRoles("admin"), deleteOneNewItem);

module.exports = router;
