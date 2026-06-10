"use client";

import MDEditor from "@uiw/react-md-editor";
import { Upload, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALLOWED_TYPE, MAX_FILE_SIZE } from "@/lib/constants";

interface LogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
  logId?: string;
}

interface FormData {
  title: string;
  content: string;
  files: File[];
}

interface FormErrors {
  title?: string;
  content?: string;
}

export default function LogEditor({
  initialTitle = "",
  initialContent = "",
  isEditing = false,
  logId,
}: LogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles).filter(
      (f) => f.size <= MAX_FILE_SIZE && ALLOWED_TYPE.includes(f.type),
    );
    if (newFiles.length !== selectedFiles.length) {
      alert("Some files are not allowed");
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData: FormData = {
      title: title.trim(),
      content: content.trim(),
      files,
    };

    console.log("Form submitted:", {
      action: isEditing ? "edit" : "create",
      logId: isEditing ? logId : undefined,
      data: formData,
    });

    setIsSubmitting(false);

    alert(
      `Log ${
        isEditing ? "updated" : "created"
      } successfully, check console for form data.`,
    );
  };

  const handleCancel = () => {
    const shouldLeave = window.confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost.",
    );
    if (shouldLeave) {
      console.log("User cancelled editing");
    }
  };

  const pageTitle = isEditing ? "Edit Log" : "Create New Log";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        {isEditing && logId && (
          <p className="text-muted-foreground mt-2">Editing Log ID: {logId}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter log title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown) *</Label>
              <div
                className={`border rounded-md ${
                  errors.content ? "border-destructive" : ""
                }`}
              >
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={true}
                  textareaProps={{
                    placeholder: "Write your log content in Markdown...",
                    style: {
                      fontSize: 14,
                      lineHeight: 1.5,
                      fontFamily: "var(--font-mono)",
                    },
                  }}
                />
              </div>
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Label
                  htmlFor="file-upload"
                  className="flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center"
                >
                  <Upload className="h-12 w-12 text-muted-foreground/50" />

                  <span className="text-sm font-medium">
                    Click to upload files
                  </span>

                  <span className="text-xs text-muted-foreground max-w-md">
                    Upload images, documents, or other files to attach to your
                    log
                  </span>
                </Label>

                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </div>
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Uploaded Files:</Label>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: order of files won't change
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {file.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? "Saving..." : "Save Log"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
