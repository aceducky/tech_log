import LogViewer from "@/components/log_viewer";

const mockContent = `# Welcome to Tech Log

Welcome to TechLog, your personal space for documenting technical knowledge, troubleshooting steps, software discoveries, setup guides, reviews, and lessons learned.

## What is Tech Log?

Tech Log is a place to capture and organize technical information in a clean, searchable format. Whether you're documenting a software setup, reviewing a tool, writing a how-to guide, or recording a solution to a problem you solved, Tech Log helps you build a searchable record of your technical experience.

### Key Features

* **Markdown Support**: Write logs using familiar Markdown syntax
* **Real-time Preview**: See your formatting as you write
* **File Attachments**: Add screenshots, images, and documents
* **Responsive Design**: Read and write comfortably on any device
* **Search Functionality**: Quickly find past logs and solutions

## Getting Started

### Writing Your First Log

1. Click the **"New Log"** button
2. Enter a clear, descriptive title
3. Write your content using Markdown
4. Optionally attach screenshots or files
5. Click **"Save Log"** to publish

### Markdown Basics

Here are some common Markdown elements you can use:

**Bold text** and *italic text*

* Bullet points
* Work great for notes
* Easy to scan later

1. Numbered lists
2. Useful for procedures
3. Perfect for troubleshooting guides

> Blockquotes are useful for notes, warnings, commands, or information from external sources.

### Code Examples

You can include inline \`code\` or full code blocks:

\`\`\`javascript
function welcomeMessage() {
  console.log("Welcome to Tech Log!");
  return "Happy logging!";
}
\`\`\`

### Links and References

Add links to documentation, GitHub repositories, support articles, or other resources relevant to your log.

## Advanced Features

### Tables

| Feature         | Description                      | Status      |
| --------------- | -------------------------------- | ----------- |
| Markdown Editor | Rich text editing                | ✅ Available |
| File Uploads    | Attach screenshots and documents | ✅ Available |
| Search          | Find logs quickly                | ✅ Available |

### Images

Embed screenshots, diagrams, and other visuals directly within your logs to provide additional context.

## Logging Best Practices

1. **Use clear, searchable titles**. Include software names, error messages, or topics you may need to find later.
2. **Document the solution, not just the problem**. Include the steps that resolved the issue and any lessons learned.
3. **Record versions and environment details**. Software versions, operating systems, and configuration details often matter.
4. **Add screenshots when helpful**. Visual references can make issues and fixes easier to understand.
5. **Keep logs current**. Update older entries when tools, workflows, or solutions change.

Start building your technical knowledge base, one log at a time.`;
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: remove mock permission
  const canEdit = true;

  const mockLog = {
    id: Number(id),
    title: "Welcome to Tech Log",
    content: mockContent,
    author: "Admin User",
    createdAt: "2024-01-15",
    imageUrl: "/placeholder.png",
  };

  return <LogViewer log={mockLog} canEdit={canEdit} />;
}
