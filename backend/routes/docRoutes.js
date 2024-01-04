import express from "express";
import {
  getDocs,
  getDocumentById,
  createDocument, 
  updateDocument,
  deleteDocument,
  createDocumentReview,
  getTopDocuments,
  getAllFavorites,
} from "../controllers/docController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getDocs).post(protect, admin, createDocument);
router.route("/top").get(getTopDocuments);
router
  .route("/:id")
  .get(getDocumentById)
  .put(protect, admin, updateDocument)
  .delete(protect, admin, deleteDocument);
router.route("/:id/reviews").post(protect, createDocumentReview);
router.route("/allFav").get(protect,getAllFavorites)

export default router;
