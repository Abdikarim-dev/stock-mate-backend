const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRouter = require("./routes/Auth");
const alertRouter = require("./routes/Alert");
const dashboardRouter = require("./routes/Dashboard");
const userRouter = require("./routes/User");
const storeRouter = require("./routes/Store");
const newItemRouter = require("./routes/NewItem");
const importedItemRouter = require("./routes/ImportedItem");
const exportedItemRouter = require("./routes/ExportedItem");
const damagedItemRouter = require("./routes/DamagedItem");
const storeTransferItem = require("./routes/StoreToStoreTransfer");

const { connectDB } = require("./config/config");
const { authenticate } = require("./middleware/authMiddleware");


const app = express();
const PORT = 4004;

app.use(express.json());
app.use(cors())
connectDB();

app.use("/api/auth", authRouter);

app.use("/api/dashboard", authenticate, dashboardRouter)
app.use("/api/user", authenticate, userRouter);
app.use("/api/alert", authenticate, alertRouter);
app.use("/api/store", authenticate, storeRouter);
app.use("/api/new-item", authenticate, newItemRouter);

app.use("/api/import-item", authenticate, importedItemRouter);
app.use("/api/export-item", authenticate, exportedItemRouter);
app.use("/api/store-to-store", authenticate, storeTransferItem)
app.use("/api/damaged-item", authenticate, damagedItemRouter)

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
});

