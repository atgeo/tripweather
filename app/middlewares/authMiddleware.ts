import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { config } from "dotenv";

config();

interface TWRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: TWRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const token = authHeader.substring(7, authHeader.length);

  try {
    const jwtSecret = process.env.JWT_SECRET || "";

    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded == "object" && "userId" in decoded) {
      // Check if the user exists in the database, and if needed, store user information in req.user
      const user = await User.findById(decoded.userId).exec();

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      next();
    } else {
      //todo check if needed
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  verifyToken,
};
