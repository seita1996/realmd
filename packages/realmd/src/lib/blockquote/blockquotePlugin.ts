import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

// Style for blockquotes in markdown
export const blockquoteStyle = HighlightStyle.define([
  { tag: tags.quote, color: "#9e9e9e", fontStyle: "italic" }
]);

// Theme for blockquotes to add visual styling with a left border
export const blockquoteTheme = EditorView.baseTheme({
  ".cm-blockquote": {
    borderLeft: "4px solid #9e9e9e",
    paddingLeft: "16px",
    marginLeft: "4px",
    display: "block",
    color: "#9e9e9e",
    fontStyle: "italic"
  }
});

// Plugin to hide blockquote markers and transform display
export const blockquotePlugin = ViewPlugin.fromClass(class {
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
        if (type.name === "Blockquote") {
          // Get the content of each line in the blockquote
          const lines = state.doc.sliceString(node.from, node.to).split('\n');
          let startPos = node.from;
          
          for (const line of lines) {
            const match = line.match(/^(>\s*)(.*)/);
            if (match) {
              const [, marker, content] = match;
              const markerEnd = startPos + marker.length;
              
              // Hide the '>' marker at the beginning of each line
              decorations.push(Decoration.replace({
                inclusive: true
              }).range(startPos, markerEnd));
              
              // Apply blockquote styling to the content
              decorations.push(Decoration.mark({
                class: "cm-blockquote"
              }).range(startPos, startPos + line.length));
            }
            
            startPos += line.length + 1; // +1 for newline
            if (startPos > node.to) break;
          }
        }
      }
    });

    return Decoration.set(decorations);
  }
}, {
  decorations: v => v.decorations
});