import JWT from "jsonwebtoken";
import userModel from "../models/authModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'No authorization header' });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log('JWT Error:', error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Single user access - no role needed
export const isUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in user middleware",
    });
  }
};