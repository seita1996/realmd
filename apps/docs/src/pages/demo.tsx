import React from 'react';
import Layout from '@theme/Layout';
import { Editor } from 'realmd';

export default function Demo() {
  const sample = `
# Markdown Editor Demo

## Basic Features

### Checkboxes and Lists
- [ ] Implement dark mode
- [x] Add syntax highlighting
- [x] Support tables

- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item
   2. Another nested item

### Text Formatting
**Bold text** and *italic text* and ~~strikethrough~~

### Links and Images
[Visit GitHub](https://github.com)
![pen](https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80)

## Code Examples

Inline code: \`const greeting = "Hello, World!";\`

Code block with syntax highlighting:
\`\`\`typescript
interface User {
  name: string;
  age: number;
}

function greetUser(user: User) {
  console.log(\`Hello, \${user.name}!\`);
}
\`\`\`

\`\`\`javascript
// Example of async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Blockquotes

> This is a simple blockquote
> 
> It can span multiple lines
> 
> > And can be nested too!

## Tables

| Feature | Status | Description |
|---------|--------|-------------|
| Tables | ✅ | Formatted tables with alignment |
| Code Blocks | ✅ | Syntax highlighting support |
| Blockquotes | ✅ | Text quotations with nesting |
| Links | ✅ | Hyperlinks with hover effects |

### Complex Table Example

| Left-aligned | Center-aligned | Right-aligned |
|:------------|:-------------:|-------------:|
| Left | Center | Right |
| longer text | *italic* | **bold** |
| \`code\` | [link](https://example.com) | Numbers |
`

  return (
    <Layout>
      <h1>Demo</h1>
      <p>This is a Demo page</p>
      <Editor text={sample} />
    </Layout>
  );
}
