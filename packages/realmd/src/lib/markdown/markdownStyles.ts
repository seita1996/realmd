import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

// Enhanced styling for various markdown elements
export const markdownStyles = HighlightStyle.define([
  // Text formatting
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  
  // Lists (other than bullet)
  { tag: tags.list, margin: "8px 0" },
  { tag: tags.labelName, color: "#e6db74" }, // For definition lists
  
  // Horizontal rule
  { tag: tags.processingInstruction, display: "block", borderBottom: "1px solid #555", margin: "12px 0" },
  
  // Inline code
  { tag: tags.monospace, fontFamily: "monospace", backgroundColor: "rgba(0, 0, 0, 0.3)", padding: "2px 4px", borderRadius: "3px" },
]);

// Theme for additional markdown elements
export const markdownTheme = EditorView.baseTheme({
  // Horizontal rule styling
  ".cm-processing": {
    height: "2px",
    margin: "16px 0"
  },
  
  // Definition list styling
  ".cm-list": {
    paddingLeft: "20px"
  },
  
  // Task list styling (for items not covered by checkbox plugin)
  ".cm-meta.cm-list": {
    color: "#75715e"
  },
  
  // Text formatting styles
  ".cm-strong": {
    fontWeight: "bold"
  },
  ".cm-emphasis": {
    fontStyle: "italic"
  },
  ".cm-strikethrough": {
    textDecoration: "line-through"
  }
});

// Simplified plugin to hide markdown formatting characters
export const formattingPlugin = ViewPlugin.fromClass(class {
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

    // Using a simpler approach with visible ranges
    for (let {from, to} of view.visibleRanges) {
      syntaxTree(state).iterate({
        from, to,
        enter: (node) => {
          const type = node.type.name;
          
          // Handle bold text (** or __)
          if (type === "StrongEmphasis") {
            // Add styling
            decorations.push(Decoration.mark({
              class: "cm-strong"
            }).range(node.from, node.to));
            
            // Try to find opening and closing markers to hide
            if (node.from < node.to - 1) {
              // Hide first two characters (** or __)
              decorations.push(Decoration.replace({}).range(node.from, node.from + 2));
              
              // Hide last two characters (** or __)
              decorations.push(Decoration.replace({}).range(node.to - 2, node.to));
            }
          }
          
          // Handle italic text (* or _)
          else if (type === "Emphasis") {
            // Add styling
            decorations.push(Decoration.mark({
              class: "cm-emphasis"
            }).range(node.from, node.to));
            
            // Hide markers
            if (node.from < node.to) {
              // Hide first character (* or _)
              decorations.push(Decoration.replace({}).range(node.from, node.from + 1));
              
              // Hide last character (* or _)
              decorations.push(Decoration.replace({}).range(node.to - 1, node.to));
            }
          }
          
          // Handle strikethrough text (~~)
          else if (type === "Strikethrough") {
            // Add styling
            decorations.push(Decoration.mark({
              class: "cm-strikethrough"
            }).range(node.from, node.to));
            
            // Hide markers
            if (node.from < node.to - 1) {
              // Hide first two characters (~~)
              decorations.push(Decoration.replace({}).range(node.from, node.from + 2));
              
              // Hide last two characters (~~)
              decorations.push(Decoration.replace({}).range(node.to - 2, node.to));
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