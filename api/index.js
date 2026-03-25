require("dotenv").config({ path: '../.env' });
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// DB bağlantısı
connectDB();

// Routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);

// Server başlat
const PORT = 3000;
app.listen(PORT, () => console.log(`Server çalışıyor: http://localhost:${PORT}`));