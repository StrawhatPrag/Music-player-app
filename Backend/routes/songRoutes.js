import express from "express";
import {
  getPlaylistByTag,
  getSongs,
  toggleFavourite,
} from "../controllers/songController.js";
import { protect } from "../middleware/authMiddleware.js";

const songRouter = express.Router();

songRouter.get("/", getSongs);
songRouter.get("/playlistByTag/:tag", getPlaylistByTag);
songRouter.post("/favourite", protect, toggleFavourite);
songRouter.get("/favourites", protect, (req, res) => {
  res.json(req.user.favourites);
});

export default songRouter;
