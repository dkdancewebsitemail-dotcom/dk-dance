import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import "@/lib/uploadthing-server"; // Ensures IPv4 DNS resolution for UploadThing API endpoints

export const runtime = "nodejs";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET,
  },
});
