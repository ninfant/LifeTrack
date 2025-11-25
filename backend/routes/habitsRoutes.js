import express from "express";
import {
  createHabits,
  getallhabits,
  gethabitbyid,
  deletehabitbyid,
  updatehabitbyid,
  logHabitCompletion,
  getHabitStreak,
} from "../controllers/habitsController.js";

const router = express.Router();

router.post("/create", createHabits);
router.get("/getall/:userId", getallhabits);
router.get("/get/:id", gethabitbyid);
router.delete("/delete/:id", deletehabitbyid);
router.put("/update/:id", updatehabitbyid);
router.post("/log-completion/:id", logHabitCompletion);
router.get("/get-streak/:id", getHabitStreak);
export default router;
