import { createRouteHandler } from "uploadthing/next";
import { imgFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: imgFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
