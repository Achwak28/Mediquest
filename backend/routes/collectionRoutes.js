import express from "express";
import {
  createNewCollection,
  getMyCollections,
  getCollectionById,
  deleteCollection,
  updateCollectionTitle,
  getCollections,
  changeCollectionTitle,
} from "../controllers/collectionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createNewCollection)
  .get(protect, admin, getCollections);
router.route("/mycollections").get(protect, getMyCollections);
router
  .route("/:id")
  .get(protect, getCollectionById)
  .put(protect, updateCollectionTitle)
  .delete(protect, deleteCollection);
router.route("/:id/title").put(protect, changeCollectionTitle);

export default router;
