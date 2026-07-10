import { useTheme } from "next-themes";
import rehypeSanitize from "rehype-sanitize";
import { ClientOnlyMDEditor } from "@/components/client_only_mdeditor";

type LogMDEditorProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
};

export function LogMDEditor({ value, onChange, onBlur }: LogMDEditorProps) {
  const { resolvedTheme } = useTheme();

  return (
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
    />
  );
}
