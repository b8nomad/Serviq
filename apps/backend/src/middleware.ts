import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

import prisma from "@serviq/prisma";

import { JWT_SECRET } from "config";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        username: string;
        permissions: string[];
      };
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  try {
    const token_decoded = jwt.verify(token, JWT_SECRET!) as { id: string };

    const user = await prisma.user.findFirst({
      where: {
        id: token_decoded.id,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const permissionKeys = user.permissions.map((p) => p.permission.key);

    req.user = {
      id: user.id,
      name: user.name,
      username: user.username!,
      email: user.email,
      permissions: permissionKeys,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const can = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { permissions } = req.user;
    if (!permissions.includes(permission))
      return res.status(403).json({ error: "Unauthorized!" });
    next();
  };
};

export { auth, can };
