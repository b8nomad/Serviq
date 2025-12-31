import { Router } from "express";
import { queues } from "@serviq/bull";

import prisma from "@serviq/prisma";

const router = Router();

router.post("/external/ticket", async (req, res) => {
  const { name, title, description, email } = req.body;
  let user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user)
    user = await prisma.user.create({
      data: {
        name,
        username: email.split("@")[0] + "_" + Math.floor(Math.random() * 1000),
        email,
      },
    });

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      author_id: user.id,
    },
  });

  queues.ticket.created({
    ticket_id: ticket.id,
  });

  res.json({
    success: true,
    message:
      "Ticket #" + ticket.number?.toString().padStart(6, "0") + " created!",
  });
});

router.get("/external/ticket/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) res.status(422).json({ error: "ID invalid!", success: false });
  const ticket = prisma.ticket.findFirst({
    where: {
      id,
    },
    include: {
      assignees: true,
      events: true,
    },
  });

  res.json({ message: "Ticket fetched successfully!", success: true });
});

export default router;
