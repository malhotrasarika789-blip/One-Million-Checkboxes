import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

// console.log("REDIS_URL:", process.env.REDIS_URL);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
    app.get("/", (req, res) => {
    res.send("One Million Checkboxes backend is running 🚀");
});

export default app;