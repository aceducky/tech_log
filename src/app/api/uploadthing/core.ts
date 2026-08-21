import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { MAX_IMAGE_SIZE } from "@/config/constants";
import { getCurrentSession } from "@/lib/auth/get_current_session";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const imgFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  coverImgUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: MAX_IMAGE_SIZE,
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      // If you throw, the user will not be able to upload
      const session = await getCurrentSession();
      if (!session) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { fileUrl: file.ufsUrl };
    }),
  contentImageUploader: f({
    image: {
      maxFileSize: MAX_IMAGE_SIZE,
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getCurrentSession();
      if (!session) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => ({ fileUrl: file.ufsUrl })),
} satisfies FileRouter;

export type imgFileRouter = typeof imgFileRouter;
