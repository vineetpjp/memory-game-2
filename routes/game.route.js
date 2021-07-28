import express from "express";
import { GameController } from "../controllers/game.controller.js";
import { asyncErrorHandler } from "../middleware/errorHandler.js";
const router = express.Router();

router.route("/create").post(asyncErrorHandler(GameController.initGame));

router.route("/card").get(GameController.getTableCard);

// router.route("/cardtwo").get(asyncErrorHandler(GameController.getTable2Card));

router.route("/").delete(asyncErrorHandler(GameController.deleteFile));

export default router;
