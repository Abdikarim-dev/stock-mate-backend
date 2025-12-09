const express = require("express");
const { dashboardCard, topInventories } = require("../controllers/Dashboard");
const { authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/cards", authorizeRoles("admin", "staff"), dashboardCard)
router.get("/summary", authorizeRoles("admin", "staff"), topInventories)
module.exports = router;