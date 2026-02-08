import express from "express";
import { checkAuth, login, signUp, updateProfile } from "../controllers/UserController.js";
import { protectRoute } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", checkAuth);

export default router;



