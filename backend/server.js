import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import habitsRoutes from "./routes/habitsRoutes.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/users", userRoutes);
app.use("/api/habits", habitsRoutes);

connectDB(); // Connect to MongoDB

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
