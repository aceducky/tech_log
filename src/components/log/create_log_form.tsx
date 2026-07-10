"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createLog } from "@/app/actions/logs_actions";
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
  type CreateLogFormValues,
  createLogFormSchema,
} from "@/db/schemas/log-schema";
import { UploadDropzone } from "@/lib/uploadthing";
import CancelButton from "./cancel_btn";
import { LogMDEditor } from "./log_md_editor";

function getCoverUploadErrorMessage(error: Error) {
  if (error.message.includes("FileSizeMismatch")) {
    return `Cover image must be ${MAX_LOG_COVER_IMG_SIZE} or smaller.`;
  }

  if (error.message.includes("Invalid file type")) {
    return "Please upload a supported image file.";
  }

  return error.message || "Cover image upload failed. Please try again.";
}

export default function CreateLogForm() {
  const router = useRouter();
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>();

  const form = useForm<CreateLogFormValues>({
    mode: "onTouched",
    resolver: zodResolver(createLogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      coverImgUrl: undefined,
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

  async function onSubmit(data: CreateLogFormValues) {
    const res = await createLog(data);
    if (res.error || !res.data) {
      toast.error(res.message ?? "Error");
      return;
    }

    form.reset();
    resetDropzone();
    if (res.message) toast.success(res.message);
    router.replace(`/logs/${res.data}`);
  }

  async function handleRemoveCoverImage(
    onChange: (value: string | undefined) => void,
  ) {
    onChange(undefined);
    resetDropzone();
  }

  return (
    <div>
      <Card className="mx-auto w-full max-w-4xl px-4">
        <CardHeader>
          <CardTitle>Create Log</CardTitle>
        </CardHeader>

        <CardContent>
          <div>
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
                      <LogMDEditor
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? "")}
                        onBlur={field.onBlur}
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
                    const coverImgUrl = field.value;
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="cover-image">
                          Cover image
                        </FieldLabel>
                        <FieldDescription>
                          Add a cover image for the log. Max size is 2 MB. If
                          upload fails, you can retry or publish without a
                          cover.
                        </FieldDescription>
                        {coverImgUrl && coverPreviewUrl ? (
                          <div className="w-full max-w-lg">
                            <div className="aspect-4/3 max-h-80 overflow-hidden rounded-2xl border bg-muted">
                              {/** biome-ignore lint/performance/noImgElement: temporary for preview, does not need optimizations */}
                              <img
                                src={coverPreviewUrl}
                                alt="Uploaded cover preview"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-3"
                              disabled={form.formState.isSubmitting}
                              onClick={() =>
                                handleRemoveCoverImage(field.onChange)
                              }
                            >
                              Remove cover image
                            </Button>
                          </div>
                        ) : (
                          <UploadDropzone
                            key={dropzoneKey}
                            endpoint="coverImgUploader"
                            disabled={form.formState.isSubmitting}
                            onChange={(files) => {
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
                            }}
                            onUploadError={(error: Error) => {
                              const message = getCoverUploadErrorMessage(error);
                              field.onChange(undefined);
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
                  description="This action cannot be undone. This will permanently discard this log."
                  cancelText="Continue writing"
                  confirmText="Discard log"
                  onConfirm={() => {
                    form.reset();
                    resetDropzone();
                    router.push("/logs");
                  }}
                />
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                >
                  Publish log
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
