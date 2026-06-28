import { createRouteHandler } from "uploadthing/next";
import { coverImgFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: coverImgFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
