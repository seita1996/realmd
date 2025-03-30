import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

// Theme for ordered lists
export const orderedListTheme = EditorView.baseTheme({
  ".cm-ordered-list-item": {
    display: "list-item",
    marginLeft: "2em",
    listStyleType: "decimal"
  },
  ".cm-ordered-list-item-nested": {
    listStyleType: "lower-alpha",
    marginLeft: "1em"
  },
  ".cm-ordered-list-item-nested2": {
    listStyleType: "lower-roman",
    marginLeft: "1em"
  }
});

// Plugin to format ordered lists
export const orderedListPlugin = ViewPlugin.fromClass(class {
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

    // Find ordered list items
    for (let {from, to} of view.visibleRanges) {
      syntaxTree(state).iterate({
        from, to,
        enter: (node) => {
          const type = node.type;
          
          if (type.name === "OrderedList") {
            // Handle the whole list
            decorations.push(Decoration.mark({
              class: "cm-ordered-list"
            }).range(node.from, node.to));
          }
          
          if (type.name === "ListItem" && node.node.parent?.name === "OrderedList") {
            const line = state.doc.lineAt(node.from);
            const lineText = line.text;
            
            // Check for ordered list pattern (number + dot + space)
            const match = lineText.match(/^(\s*)(\d+)\.(\s+)(.*)/);
            if (match) {
              const [, indent, number, space, content] = match;
              const markerEnd = line.from + indent.length + number.length + 1 + space.length; // +1 for the dot
              
              // Calculate nesting level based on indentation
              const nestingLevel = Math.floor(indent.length / 3); // Assuming 3 spaces per level
              const listItemClass = nestingLevel === 0 
                ? "cm-ordered-list-item" 
                : nestingLevel === 1 
                  ? "cm-ordered-list-item-nested" 
                  : "cm-ordered-list-item-nested2";
              
              // Hide the original number marker
              decorations.push(Decoration.replace({
                inclusive: true
              }).range(line.from, markerEnd));
              
              // Apply ordered list styling to the content
              decorations.push(Decoration.mark({
                class: listItemClass
              }).range(line.from, line.to));
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