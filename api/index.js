
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");  // ← YUKARI TAŞINDI

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);  // ← YUKARI TAŞINDI

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlandı"))
  .catch(err => console.log("Mongo hata:", err));

app.listen(5000, () => {
  console.log("Server çalışıyor");
});


