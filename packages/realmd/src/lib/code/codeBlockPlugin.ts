import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

// Create a more comprehensive syntax highlighting for code blocks
export const codeBlockHighlighting = HighlightStyle.define([
  // Code block styling
  { tag: tags.content, color: "#f8f8f2" },
  { tag: tags.monospace, fontFamily: "monospace" },
  { tag: tags.processingInstruction, color: "#f92672" },
  { tag: tags.comment, color: "#75715e", fontStyle: "italic" },
  { tag: tags.string, color: "#e6db74" },
  { tag: tags.keyword, color: "#66d9ef", fontWeight: "bold" },
  { tag: tags.number, color: "#ae81ff" },
  { tag: tags.operator, color: "#f92672" },
  { tag: tags.className, color: "#a6e22e" },
  { tag: tags.definition(tags.variableName), color: "#fd971f" },
  { tag: tags.function(tags.variableName), color: "#a6e22e" },
  { tag: tags.propertyName, color: "#66d9ef" },
  { tag: tags.typeName, color: "#66d9ef", fontStyle: "italic" },
]);

// Theme for code blocks
export const codeBlockTheme = EditorView.baseTheme({
  ".cm-code-block": {
    fontFamily: "monospace",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "8px 12px",
    borderRadius: "4px",
    display: "block",
    margin: "8px 0",
    overflowX: "auto",
    fontSize: "0.9em",
    lineHeight: "1.5"
  },
  ".cm-code-lang": {
    color: "#888",
    fontSize: "0.8em",
    fontFamily: "monospace",
    display: "block",
    borderBottom: "1px solid #444",
    marginBottom: "8px",
    paddingBottom: "4px"
  }
});

// Plugin to hide triple backticks and transform code block display
export const codeBlockPlugin = ViewPlugin.fromClass(class {
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
        if (type.name === "FencedCode") {
          const codeBlockText = state.doc.sliceString(node.from, node.to);
          // Ensure we match the fenced code correctly
          const match = codeBlockText.match(/^```(\w*)\n([\s\S]*?)```$/m);
          
          if (match) {
            const [whole, lang, code] = match;
            
            // Replace with content that preserves the original code but hides backticks
            const codeLines = code.trim().split('\n');
            const codeContent = document.createElement('div');
            codeContent.className = 'cm-code-block';
            
            if (lang) {
              const langDiv = document.createElement('div');
              langDiv.className = 'cm-code-lang';
              langDiv.textContent = lang;
              codeContent.appendChild(langDiv);
            }

            const codeDiv = document.createElement('div');
            codeDiv.textContent = code;
            codeContent.appendChild(codeDiv);
            
            // Use a simpler decoration approach 
            decorations.push(Decoration.mark({
              class: "cm-code-block" 
            }).range(node.from, node.to));
            
            // Instead of trying to completely replace with styling, just hide the backticks
            const openBackticks = state.doc.sliceString(node.from, node.from + 3 + (lang ? lang.length : 0));
            const closeBackticksPos = node.to - 3;
            
            // Hide opening backticks
            decorations.push(Decoration.replace({}).range(node.from, node.from + 3 + (lang ? lang.length : 0)));
            
            // Hide closing backticks
            decorations.push(Decoration.replace({}).range(closeBackticksPos, node.to));
          }
        }
      }
    });

    return Decoration.set(decorations);
  }
}, {
  decorations: v => v.decorations
});