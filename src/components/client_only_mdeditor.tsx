import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const ClientOnlyMDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-50 w-full rounded-md" />,
  },
);
