import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/getallusers", getAllUsers);
router.get("/getuserbyid/:id", getUserById);

export default router;
