import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

// Style for inline code in markdown
export const inlineCodeStyle = HighlightStyle.define([
  { tag: tags.monospace, fontFamily: "monospace", backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: "3px" }
]);

// Theme for inline code
export const inlineCodeTheme = EditorView.baseTheme({
  ".cm-inline-code": {
    fontFamily: "monospace",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "2px 4px",
    borderRadius: "3px",
    fontSize: "0.9em"
  }
});

// Simplified plugin to hide backticks and transform inline code display
export const inlineCodePlugin = ViewPlugin.fromClass(class {
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

    // Using a safer approach with direct node access
    for (let {from, to} of view.visibleRanges) {
      syntaxTree(state).iterate({
        from, to,
        enter: (node) => {
          if (node.type.name === "InlineCode") {
            // Apply the styling to the whole node
            decorations.push(Decoration.mark({
              class: "cm-inline-code"
            }).range(node.from, node.to));
            
            // Hide the backticks by adding transparent overlay
            if (node.from < node.to) {
              // Hide opening backtick
              decorations.push(Decoration.replace({}).range(node.from, node.from + 1));
              
              // Hide closing backtick
              if (node.to > node.from + 1) {
                decorations.push(Decoration.replace({}).range(node.to - 1, node.to));
              }
            }
          }
        }
      });
    }

    return Decoration.set(decorations);
  }
}, {
  decorations: v => v.decorations
});