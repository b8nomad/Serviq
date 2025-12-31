import express from "express";

import { PORT } from "config";
import userRoutes from "@/src/routes/users";
import adminRoutes from "@/src/routes/admin";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}/api/v1`);
});
