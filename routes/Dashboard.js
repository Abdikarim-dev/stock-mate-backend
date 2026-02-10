const express = require("express");
const { dashboardCard, topInventories } = require("../controllers/Dashboard");
const { authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/cards", authorizeRoles("ADMIN", "STAFF"), dashboardCard)
router.get("/summary", authorizeRoles("ADMIN", "STAFF"), topInventories)
module.exports = router;