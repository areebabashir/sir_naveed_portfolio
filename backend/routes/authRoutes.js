import express from "express";

import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
} from "../controllers/authController.js";
import { requireSignIn, isUser } from "../Middlewares/authMiddlewares.js";
//router object
const router = express.Router();

//get all user


//routing
//REGISTER || METHOD POST
router.post("/register", registerController);


//LOGIN 
router.post("/login", loginController);

//forget passworrd || post
router.post("/ForgetPassword", forgotPasswordController);
//test routes
router.get("/test", requireSignIn, isUser, testController);

//protected route auth
//user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);




export default router;