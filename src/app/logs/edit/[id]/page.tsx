import type { LogIdParams } from "../../types";

export default async function Page({ params }: LogIdParams) {
  const { id } = await params;
  return <div>Edit log {id}</div>;
}
