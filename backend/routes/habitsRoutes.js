import express from "express";
import {
  createHabits,
  getAllHabits,
  getHabitById,
  deleteHabitById,
  updateHabitById,
  logHabitCompletion,
  getHabitStreak,
  getHabitStats,
} from "../controllers/habitsController.js";

const router = express.Router();

router.post("/create", createHabits);
router.get("/getall/:userId", getAllHabits);
router.get("/get/:id", getHabitById);
router.delete("/delete/:id", deleteHabitById);
router.put("/update/:id", updateHabitById);
router.post("/log-completion/:id", logHabitCompletion);
router.get("/get-streak/:id", getHabitStreak);
router.get("/get-stats/:id", getHabitStats); // Nuevo endpoint completo
export default router;
