const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const connectDB=require("./src/config/db")
const authRoutes =require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");

dotenv.config();

const app = express();

connectDB()

// Middleware
app.use(cors({
    origin: "https://ecommerecesitefrontend-git-main-sumit-dev1.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Authentication & Product CRUD API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});