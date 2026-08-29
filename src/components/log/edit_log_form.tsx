"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateLog } from "@/app/actions/logs_actions";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type EditLogFormValues,
  editLogFormSchema,
  type Log,
} from "@/db/schemas/log-schema";
import { UploadDropzone } from "@/lib/uploadthing";
import { getImgUploadErrorMessage } from "@/lib/utils";
import CancelButton from "./cancel_btn";
import { LogMDEditor } from "./log_md_editor";

type EditLogFormProps = Pick<Log, "slug" | "title" | "content" | "coverImgUrl">;

export default function EditLogForm({
  slug,
  title,
  content,
  coverImgUrl,
}: EditLogFormProps) {
  const router = useRouter();
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>();
  const [showCoverPreview, setShowCoverPreview] = useState(!!coverImgUrl);

  const form = useForm<EditLogFormValues>({
    mode: "onTouched",
    resolver: zodResolver(editLogFormSchema),
    defaultValues: {
      title,
      content,
      coverImgUrl: coverImgUrl ?? undefined,
    },
  });

  useEffect(() => {
    return () => {
      if (coverPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  function replaceCoverPreviewUrl(nextUrl?: string) {
    if (coverPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverPreviewUrl(nextUrl);
  }

  function resetDropzone() {
    replaceCoverPreviewUrl(undefined);
    setDropzoneKey((current) => current + 1);
  }

  async function onSubmit(data: EditLogFormValues) {
    const { dirtyFields } = form.formState;
    const dirtyData: Record<string, unknown> = {};
    for (const key of Object.keys(
      dirtyFields,
    ) as (keyof typeof dirtyFields)[]) {
      dirtyData[key] = data[key];
    }

    const res = await updateLog({ ...dirtyData, slug });
    if (res.error) {
      toast.error(res.message ?? "Error");
      return;
    }
    if (res.message) toast.success(res.message);
    router.push(`/logs/${slug}`);
  }

  return (
    <div>
      <Card className="mx-auto w-full max-w-4xl px-4">
        <CardHeader>
          <CardTitle>Edit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="coverImgUrl"
                control={form.control}
                render={({ field, fieldState }) => {
                  // blob URL takes priority (new upload), falls back to existing remote URL
                  const previewSrc = coverPreviewUrl ?? coverImgUrl;
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="cover-image">Cover image</FieldLabel>
                      <FieldDescription>
                        Add a cover image for the log. Max size is 2 MB. If
                        upload fails, you can retry or publish without a cover.
                      </FieldDescription>
                      {showCoverPreview && previewSrc ? (
                        <div className="w-full max-w-lg">
                          <div className="aspect-4/3 max-h-80 overflow-hidden rounded-2xl border bg-muted">
                            {/** biome-ignore lint/performance/noImgElement: Form previews may use blob URLs. */}
                            <img
                              src={previewSrc}
                              alt="Cover preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-3"
                            disabled={form.formState.isSubmitting}
                            onClick={() => {
                              field.onChange(null);
                              resetDropzone();
                              setShowCoverPreview(false);
                            }}
                          >
                            Change cover image
                          </Button>
                        </div>
                      ) : (
                        <UploadDropzone
                          key={dropzoneKey}
                          endpoint="coverImgUploader"
                          disabled={form.formState.isSubmitting}
                          onChange={(files) => {
                            form.clearErrors("coverImgUrl");
                            const file = files[0];
                            if (!file) {
                              replaceCoverPreviewUrl(undefined);
                              return;
                            }
                            replaceCoverPreviewUrl(URL.createObjectURL(file));
                          }}
                          onClientUploadComplete={(res) => {
                            const fileUrl = res[0]?.ufsUrl;
                            if (!fileUrl) return;
                            field.onChange(fileUrl);
                            setShowCoverPreview(true);
                          }}
                          onUploadError={(error: Error) => {
                            const message = getImgUploadErrorMessage(error);
                            field.onChange(null);
                            resetDropzone();
                            toast.error(message);
                          }}
                        />
                      )}
                    </Field>
                  );
                }}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                    <LogMDEditor
                      value={field.value ?? ""}
                      onChange={(value) => field.onChange(value ?? "")}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className="mt-4 flex items-center justify-end gap-4">
              <CancelButton
                disabled={form.formState.isSubmitting}
                title="Are you sure?"
                description="This will discard your unsaved changes."
                cancelText="Continue editing"
                confirmText="Discard changes"
                onConfirm={() => router.back()}
              />
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isDirty
                }
              >
                Update log
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function EditLogFormSkeleton() {
  return (
    <div>
      <Card className="mx-auto w-full max-w-4xl px-4">
        <CardHeader>
          <CardTitle>Edit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <div className="mt-4 flex items-center justify-end gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
