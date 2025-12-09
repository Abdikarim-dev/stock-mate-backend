const express = require("express");
const { dashboardCard, topInventories } = require("../controllers/Dashboard");
const { authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/cards", authorizeRoles("ADMIN", "staff"), dashboardCard)
router.get("/summary", authorizeRoles("ADMIN", "staff"), topInventories)
module.exports = router;