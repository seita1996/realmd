# Getting Started with Realmd

Realmd is a CodeMirror-based editor library for Markdown. It provides enhanced features for editing Markdown content, such as interactive checkboxes and image previews.

## Installation

You can install Realmd using npm or yarn:

```bash
npm install realmd
# or
yarn add realmd
# or
pnpm add realmd
```

## Basic Usage

To use the Realmd editor in your React application, you can import the `Editor` component and include it in your JSX:

```jsx
import { Editor } from "realmd";
import React, { useState } from "react";

function MyEditor() {
  const [text, setText] = useState("Hello, Realmd!");

  return (
    <Editor
      text={text}
      // Add other props or extensions here
    />
  );
}

export default MyEditor;
```

The `Editor` component accepts a `text` prop for the initial content. You can manage the editor's content using state, as shown in the example.

## Next Steps

- Learn about the available [Plugins](#plugins).
- Explore [Customization](#customization) options.
