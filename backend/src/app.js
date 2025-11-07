const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes=require('./routes/auth.routes');
const adminRoutes=require('./routes/admin.routes');
const storesRoutes=require('./routes/stores.routes');
const ratingsRoutes=require('./routes/rating.routes');
const ownerRoutes=require('./routes/owner.routes');
const cors = require('cors');
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true, credentials: true }));
app.use(cookieParser());
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/stores",storesRoutes);
app.use("/api/ratings",ratingsRoutes);
app.use("/api/owner",ownerRoutes);

module.exports = app;