import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
})

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})