import { Router, type Request, type Response } from "express";

import jwt from "jsonwebtoken";

import prisma from "@serviq/prisma";

import bcrypt, { genSalt } from "bcrypt";

import { auth, can } from "@/src/middleware";

const JWT_SECRET = process.env.JWT_TOKEN!;

const router = Router();

// Route: Signin
router.post("/auth/signin", async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!password || (!email && !username))
    return res.status(400).json({ error: "All fields are required!" });

  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email))
    return res.status(422).json({ error: "Email is invalid!" });

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (!user) return res.status(400).json({ error: "User not found!" });

  const isPassCorrect = await bcrypt.compare(password, user.password || "");

  if (!isPassCorrect)
    return res.status(400).json({ error: "Password is incorrect" });

  const token = jwt.sign(
    {
      id: user!.id,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "User logged in successfully!",
    data: {
      token,
    },
  });
});

// Route: Signup
router.post("/auth/signup", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password)
    return res.status(400).json({ error: "All fields are required!" });

  const userExists = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (userExists) return res.status(422).json({ error: "User already exists" });

  const salt = await bcrypt.genSalt(11);

  const hash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hash,
    },
  });

  if (!user) return res.status(500).json({ error: "Internal Server Error" });

  res.json({
    data: { user },
    message: "User created successfully!",
  });
});

export default router;
