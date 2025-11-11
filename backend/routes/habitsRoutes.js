import express from "express";
import {
  createHabits,
  getallhabits,
  gethabitbyid,
  deletehabitbyid,
  updatehabitbyid,
} from "../controllers/habits.js";

const router = express.Router();

router.post("/create", createHabits);
router.get("/getall", getallhabits);
router.get("/get/:id", gethabitbyid);
router.delete("/delete/:id", deletehabitbyid);
router.put("/update/:id", updatehabitbyid);

export default router;
