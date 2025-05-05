# Checkbox Plugin

The checkbox plugin for Realmd allows you to render and interact with Markdown task list items (checkboxes).

## Installation

The checkbox plugin is included by default when you use the main `realmd` package.

## Usage

To enable the checkbox plugin, include `checkboxPlugin` in the `extensions` array when creating your CodeMirror editor state:

```javascript
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror"; // Or your preferred basic extensions
import { markdown } from "@codemirror/lang-markdown";
import { checkboxPlugin } from "realmd"; // Import from the realmd package

const state = EditorState.create({
  doc: "- [ ] Task item\n- [x] Completed task",
  extensions: [basicSetup, markdown(), checkboxPlugin],
});

const view = new EditorView({ state, parent: document.body });
```

## Features

- Renders `[ ]` and `[x]` as interactive checkboxes.
- Clicking the checkbox toggles its state in the Markdown source.
- Pressing the space key when the cursor is within a checkbox marker also toggles its state.

## Customization

(TODO: Add details on how to customize the appearance or behavior of checkboxes if applicable)

## API

(TODO: Add API reference for checkboxPlugin and related functions/classes)
