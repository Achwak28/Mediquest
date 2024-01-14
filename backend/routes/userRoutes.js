import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  toFav,
  getAllFavorites,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  sendOTPcode,
  updatePassword
} from "../controllers/userController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getUsers).post(registerUser);
router.route("/login").post(loginUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);
router.post("/toFav", protect, toFav);
router.route("/favourites").get(protect,getAllFavorites)
router.route("/recoveryemail").post(sendOTPcode)
router.route("/resetpassword").post(updatePassword)
export default router;
   