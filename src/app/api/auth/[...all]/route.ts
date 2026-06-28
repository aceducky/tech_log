import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "../../../../lib/auth/index";
export const { GET, POST } = toNextJsHandler(auth.handler);
