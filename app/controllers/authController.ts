import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { config } from "dotenv";

config();

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const jwtSecret = process.env.JWT_SECRET || "";

    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, {
      expiresIn: "1h",
    });

    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
