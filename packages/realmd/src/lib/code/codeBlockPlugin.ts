import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import {
  EditorView,
  Decoration,
  DecorationSet,
  ViewPlugin,
  ViewUpdate,
  WidgetType, // Import WidgetType
} from "@codemirror/view";
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
    lineHeight: "1.5",
  },
  ".cm-code-lang": {
    color: "#888",
    fontSize: "0.8em",
    fontFamily: "monospace",
    display: "block",
    borderBottom: "1px solid #444",
    marginBottom: "8px",
    paddingBottom: "4px",
  },
});

// Widget to display the language name
class LanguageWidget extends WidgetType {
  constructor(readonly lang: string) {
    super();
  }

  eq(other: LanguageWidget) {
    return other.lang === this.lang;
  }

  toDOM() {
    const langDiv = document.createElement("div");
    langDiv.className = "cm-code-lang";
    langDiv.textContent = this.lang;
    return langDiv;
  }

  ignoreEvent() {
    return true;
  }
}

// Plugin to hide triple backticks and apply styling to code blocks
export const codeBlockPlugin = ViewPlugin.fromClass(
  class {
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
            let lang = null;
            let codeStart = -1;
            let codeEnd = -1;

            // Iterate through child nodes to find language, code text, and backticks
            syntaxTree(state).iterate({
              from: node.from,
              to: node.to,
              enter: (childNode) => {
                if (childNode.type.name === "CodeInfo") {
                  lang = state.doc.sliceString(childNode.from, childNode.to);
                  // Hide the CodeInfo text (language name after backticks)
                  decorations.push(
                    Decoration.replace({}).range(childNode.from, childNode.to),
                  );
                } else if (childNode.type.name === "CodeText") {
                  codeStart = childNode.from;
                  codeEnd = childNode.to;
                  // Apply code block styling to the code text lines
                  for (
                    let i = state.doc.lineAt(codeStart).number;
                    i <= state.doc.lineAt(codeEnd).number;
                    i++
                  ) {
                    const line = state.doc.line(i);
                    decorations.push(
                      Decoration.line({
                        class: "cm-code-block",
                      }).range(line.from),
                    );
                  }
                } else if (childNode.type.name === "CodeMark") {
                  // Hide the backticks
                  decorations.push(
                    Decoration.replace({}).range(childNode.from, childNode.to),
                  );
                }
              },
            });

            // Insert language widget after the opening backticks if language exists
            if (lang && node.node.firstChild?.type.name === "CodeMark") {
              // Access firstChild via node.node
              decorations.push(
                Decoration.widget({
                  widget: new LanguageWidget(lang),
                  side: 1, // Place after the opening backticks
                }).range(node.node.firstChild.to), // Access firstChild via node.node
              );
            }
          }
        },
      });

      // Sort decorations by from position and startSide
      decorations.sort((a, b) => {
        if (a.from !== b.from) return a.from - b.from;
        return a.value.startSide - b.value.startSide;
      });

      return Decoration.set(decorations);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);
