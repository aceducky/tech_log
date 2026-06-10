import LogEditor from "@/components/log_editor";
import type { LogIdParams } from "../../types";

export default async function EditLogPage({ params }: LogIdParams) {
  const { id } = await params;

  const mockData =
    id !== "new"
      ? {
          title: `Sample log ${id}`,
          content: `# Sample Log ${id}

This is some sample markdown content for log ${id}.

## Features
- **Bold text**
- *Italic text*
- [Links](https://example.com)

## Code Example
\`\`\`javascript
console.log("Hello from log ${id}");
\`\`\`

This would normally be fetched from your API.`,
        }
      : {};

  return (
    <LogEditor
      initialTitle={mockData.title}
      initialContent={mockData.content}
      isEditing={true}
      logId={id}
    />
  );
}
