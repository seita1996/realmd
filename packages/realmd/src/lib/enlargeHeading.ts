import {tags} from "@lezer/highlight"
import {HighlightStyle} from "@codemirror/language"
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

export const enlargeHeading = HighlightStyle.define([
  {tag: tags.heading1, fontSize: "2em"},
  {tag: tags.heading2, fontSize: "1.5em"},
  {tag: tags.heading3, fontSize: "1.2em"},
  {tag: tags.monospace, backgroundColor: "var(--hybrid-mde-images-bg-color, rgba(0, 0, 0, 0.3))"}
])

// Theme for headings
export const headingTheme = EditorView.baseTheme({
  ".cm-heading": {
    fontWeight: "bold",
    margin: "1em 0 0.5em 0",
    lineHeight: "1.2"
  },
  ".cm-heading1": {
    fontSize: "2em",
    borderBottom: "1px solid #444",
    paddingBottom: "0.2em"
  },
  ".cm-heading2": {
    fontSize: "1.5em"
  },
  ".cm-heading3": {
    fontSize: "1.2em"
  }
});

// Plugin to hide the '#' characters from headings
export const headingPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.createDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.createDecorations(update.view);
    }
  }

  createDecorations(view: EditorView) {
    const decorations: Range<Decoration>[] = [];
    const { state } = view;

    syntaxTree(state).iterate({
      enter: (node) => {
        const type = node.type;
        if (type.name.startsWith("ATXHeading")) {
          const level = parseInt(type.name.slice(10), 10);
          if (isNaN(level)) return;

          const lineText = state.doc.lineAt(node.from).text;
          const match = lineText.match(/^(#+)\s+(.*)/);
          
          if (match) {
            const [, hashes, content] = match;
            const hashesEnd = node.from + hashes.length + 1; // +1 for the space
            
            // Hide the '#' characters and the space after them
            decorations.push(Decoration.replace({
              inclusive: true
            }).range(node.from, hashesEnd));
            
            // Apply heading styling to the content
            decorations.push(Decoration.mark({
              class: `cm-heading cm-heading${level}`
            }).range(node.from, node.to));
          }
        }
      }
    });

    return Decoration.set(decorations);
  }
}, {
  decorations: v => v.decorations
});