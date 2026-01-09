import { CronJob } from "cron";
import redis from "@serviq/redis";
import prisma from "@serviq/prisma";

const breachCron = new CronJob("* * * * *", async () => {
  const now = Date.now();

  const slaIds = await redis.zRangeByScore("sla:due", 0, now);

  for (const slaId of slaIds) {
    const sla = await prisma.ticketSLA.findFirst({
      where: {
        id: slaId,
      },
    });

    if (!sla || sla.status === "BREACHED") continue;

    await prisma.ticketSLA.update({
      where: {
        id: sla.id,
      },
      data: {
        status: "BREACHED",
        breached_at: new Date().toISOString(),
      },
    });

    await redis.zRem("sla:due", slaId);
  }
});

export default breachCron;
