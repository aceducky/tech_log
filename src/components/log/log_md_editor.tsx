"use client";

import {
  commands,
  type ICommand,
  type TextAreaTextApi,
} from "@uiw/react-md-editor";
import { Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useRef, useState } from "react";
import rehypeSanitize from "rehype-sanitize";
import { toast } from "sonner";
import { ClientOnlyMDEditor } from "@/components/client_only_mdeditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { getImgUploadErrorMessage } from "@/lib/utils";

type LogMDEditorProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
};

type ImageInsertion = {
  api: TextAreaTextApi;
  selection: { start: number; end: number };
};

export function LogMDEditor({ value, onChange, onBlur }: LogMDEditorProps) {
  const { resolvedTheme } = useTheme();
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const imageInsertionRef = useRef<ImageInsertion | null>(null);

  const imageUploadCommand = useMemo<ICommand>(
    () => ({
      name: "image-upload",
      keyCommand: "image",
      buttonProps: {
        "aria-label": "Upload image",
        title: "Upload image",
      },
      icon: <Upload size={14} />,
      execute: (state, api) => {
        imageInsertionRef.current = { api, selection: state.selection };
        setIsImageUploadOpen(true);
      },
    }),
    [],
  );

  return (
    <>
      <ClientOnlyMDEditor
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        autoCapitalize="off"
        autoCorrect="off"
        data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
        textareaProps={{
          placeholder: "Write your content in markdown",
        }}
        commands={commands
          .getCommands()
          .map((command) =>
            command.keyCommand === "image" ? imageUploadCommand : command,
          )}
      />
      <Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
        <DialogContent className="z-100001 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Upload an image to insert it into your markdown content.
            </DialogDescription>
          </DialogHeader>
          <UploadDropzone
            endpoint="contentImageUploader"
            onClientUploadComplete={(res) => {
              const imageUrl = res[0]?.ufsUrl;
              const imageInsertion = imageInsertionRef.current;
              if (!imageUrl || !imageInsertion) return;

              imageInsertion.api.setSelectionRange(imageInsertion.selection);
              imageInsertion.api.replaceSelection(`![image](${imageUrl})`);
              imageInsertionRef.current = null;
              setIsImageUploadOpen(false);
            }}
            onUploadError={(error: Error) => {
              const message = getImgUploadErrorMessage(error);
              toast.error(message);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
