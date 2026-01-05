import { createClient } from "redis";
import { REDIS_CRED } from "@serviq/config";

const client = await createClient(REDIS_CRED)
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
  
export default client;
