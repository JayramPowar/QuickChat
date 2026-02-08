import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getMessages, getUserForSidebar, markMsgAsSeen, sendMessage } from "../controllers/messageController.js";

const msgRouter = express.Router();

msgRouter.get("/users",protectRoute, getUserForSidebar);
msgRouter.get("/:id",protectRoute, getMessages);
msgRouter.put("/mark/:id",protectRoute, markMsgAsSeen);
msgRouter.post("/send/:id",protectRoute,sendMessage);

export default msgRouter;