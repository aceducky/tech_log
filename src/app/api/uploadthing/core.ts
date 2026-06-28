import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { MAX_LOG_COVER_IMG_SIZE } from "@/config/constants";
import { getCurrentSession } from "@/lib/auth/get_current_session";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const coverImgFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  coverImgUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: MAX_LOG_COVER_IMG_SIZE,
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
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      const fileUrl = file.ufsUrl;
      console.log("file url", fileUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { fileUrl };
    }),
} satisfies FileRouter;

export type coverImgFileRouter = typeof coverImgFileRouter;
