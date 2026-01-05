import express from "express";

import { PORT } from "config";
import userRoutes from "@/src/routes/users";
import adminRoutes from "@/src/routes/admin";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/middlewares/error";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend Server running on: http://localhost:${PORT}`);
});
