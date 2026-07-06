"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import rehypeSanitize from "rehype-sanitize";
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
import { MAX_LOG_COVER_IMG_SIZE } from "@/config/constants";
import {
  type EditLogFormValues,
  editLogFormSchema,
  type Log,
} from "@/db/schemas/log-schema";
import { UploadDropzone } from "@/lib/uploadthing";
import CancelButton from "./cancel_btn";

type EditLogFormProps = {
  id: Log["id"];
  title: Log["title"];
  content: Log["content"];
  coverImgUrl: Log["coverImgUrl"];
};

function getCoverUploadErrorMessage(error: Error) {
  if (error.message.includes("FileSizeMismatch")) {
    return `Cover image must be ${MAX_LOG_COVER_IMG_SIZE} or smaller.`;
  }
  if (error.message.includes("Invalid file type")) {
    return "Please upload a supported image file.";
  }
  return error.message || "Cover image upload failed. Please try again.";
}

export default function EditLogForm({
  id,
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
      id,
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
    const dirtyData: Record<string, unknown> = { id: data.id };
    for (const key of Object.keys(
      dirtyFields,
    ) as (keyof typeof dirtyFields)[]) {
      if (key !== "id") {
        dirtyData[key] = data[key];
      }
    }

    const res = await updateLog(dirtyData);
    if (res.error) {
      toast.error(res.message ?? "Error");
      return;
    }
    if (res.message) toast.success(res.message);
    router.push(`/logs/${id}`);
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
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                    <MDEditor
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? "")}
                      onBlur={field.onBlur}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                      autoCapitalize="off"
                      autoCorrect="off"
                      data-color-mode="light"
                      textareaProps={{
                        placeholder: "Write your content in markdown",
                        style: {
                          fontSize: 14,
                          lineHeight: 1.3,
                        },
                      }}
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
                            {/** biome-ignore lint/performance/noImgElement: temporary for preview, does not need optimizations */}
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
                            const message = getCoverUploadErrorMessage(error);
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
