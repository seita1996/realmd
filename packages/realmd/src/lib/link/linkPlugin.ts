import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

// Style for links in markdown
export const linkStyle = HighlightStyle.define([
  { tag: tags.link, color: "#58a6ff" },
  { tag: tags.url, color: "#58a6ff", display: "none" }  // Hide the URL part
]);

// Theme for links with hover effect
export const linkTheme = EditorView.baseTheme({
  ".cm-link": {
    cursor: "pointer",
    textDecoration: "underline",
    color: "#58a6ff",
    "&:hover": {
      opacity: "0.8"
    }
  }
});

// Custom widget for link rendering
class LinkWidget extends WidgetType {
  constructor(readonly text: string, readonly url: string) { super() }

  eq(other: LinkWidget) { return other.text === this.text && other.url === this.url }

  toDOM() {
    const link = document.createElement("a");
    link.textContent = this.text;
    link.className = "cm-link";
    link.title = this.url;
    link.href = this.url;
    link.target = "_blank"; // Open links in a new tab
    return link;
  }

  ignoreEvent() { return false }
}

// Enhanced plugin to properly render markdown links
export const linkPlugin = ViewPlugin.fromClass(class {
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

    for (let {from, to} of view.visibleRanges) {
      syntaxTree(state).iterate({
        from, to,
        enter: (node) => {
          const type = node.type;
          if (type.name === "Link") {
            // Find the text content and URL within the link
            const linkText = state.doc.sliceString(node.from, node.to);
            const match = linkText.match(/\[(.*?)\]\((.*?)\)/);
            
            if (match) {
              const [whole, text, url] = match;
              
              // Use a widget to render the link properly
              decorations.push(Decoration.replace({
                widget: new LinkWidget(text, url),
                inclusive: true
              }).range(node.from, node.to));
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