import { Router, type Request, type Response } from "express";

import jwt from "jsonwebtoken";

import prisma from "@serviq/prisma";

import bcrypt, { genSalt } from "bcrypt";

import { auth, can } from "@/src/middlewares/auth";

import { catchAsync } from "@serviq/lib/catchAsync.ts";
import { NotFoundError, UnauthorizedError } from "@serviq/lib/error.ts";

import { JWT_SECRET } from "config";

import { ok } from "@serviq/lib/response.ts";
import { queues } from "@serviq/bull";

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

router.get(
  "/ticket/:id",
  auth,
  can("ticket.view", "ticket.view.all"),
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
      include: {
        assignees: true,
      },
    });

    if (!ticket) throw new Error("Ticket not found");

    if (user.permissions.includes("ticket.view.all")) {
      return res.json(
        ok({ message: "Ticket fetched successfully!", data: { ticket } })
      );
    }

    const assigneeList = ticket.assignees.map((ta) => {
      return ta.user_id;
    });

    if (assigneeList.includes(user.id)) {
      res.json(
        ok({ message: "Ticket fetched successfully!", data: { ticket } })
      );
    }

    throw new UnauthorizedError();
  }
);

router.post(
  "/ticket/:id/comment",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { body, isPublic } = req.body;
    const user = req.user;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
      include: {
        assignees: true,
      },
    });

    if (!ticket) throw new NotFoundError("Ticket not found!");

    if (!ticket.assignees.some((s) => s.user_id === user.id))
      throw new UnauthorizedError("Cannot comment on the ticket!");

    const event = await prisma.ticketEvent.create({
      data: {
        ticket_id: ticket?.id,
        body,
        public: isPublic,
        type: "COMMENT",
      },
    });

    await prisma.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        status: "WAITING",
      },
    });

    // queues.ticket.event({
    //   ticket_id: ticket.id,
    //   author_id: user.id,
    //   body: "",
    //   public: true,
    //   type: "COMMENT",
    // });

    return res.json(ok({ message: "Event created!", data: { event } }));
  })
);
export default router;
