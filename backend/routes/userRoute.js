import express from "express";
import {
  allUser,
  changePassword,
  forgotPassword,
  getUserById,
  login,
  logout,
  register,
  reVerify,
  updateUser,
  verify,
  verifyOTP,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP/:email", verifyOTP);
router.post("/changePassword/:email", changePassword);
router.get("/allUser",isAuthenticated, isAdmin, allUser);
router.get("/getUser/:userId", getUserById);
router.put("/update/:id",isAuthenticated, singleUpload, updateUser);

export default router;
