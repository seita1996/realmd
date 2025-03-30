import {Decoration, DecorationSet, EditorView, WidgetType} from "@codemirror/view"
import {syntaxTree} from "@codemirror/language"
import {Range} from "@codemirror/state"

class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean) { super() }

  eq(other: CheckboxWidget) { return other.checked == this.checked }

  toDOM() {
    let wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-boolean-toggle"
    let box = wrap.appendChild(document.createElement("input"))
    box.type = "checkbox"
    box.checked = this.checked
    return wrap
  }

  ignoreEvent() { return false }
}

export function checkboxes(view: EditorView) {
  let widgets: Range<Decoration>[] = []
  for (let {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (node.name.includes("TaskMarker")) {
          // Get the entire line to identify the task marker's position within it
          const line = view.state.doc.lineAt(node.from);
          const lineText = line.text;
          
          // Check if this line starts with a list marker (- or *)
          const listMarkerMatch = lineText.match(/^(\s*)(-|\*)\s+(\[[x ]\])/i);
          if (listMarkerMatch) {
            const [, indent, listMarker, checkbox] = listMarkerMatch;
            const prefixLength = indent.length + listMarker.length + 1; // +1 for the space after the list marker
            
            // Calculate the position of the TaskMarker
            const checkboxPos = line.from + prefixLength;
            
            // Hide the original "[ ]" or "[x]" along with the list marker
            widgets.push(Decoration.replace({
              widget: new CheckboxWidget(checkbox.toLowerCase() === "[x]"),
              inclusive: false
            }).range(line.from, checkboxPos + checkbox.length));
            
            // Apply a margin to the content so it doesn't appear right after the checkbox
            const contentPos = checkboxPos + checkbox.length;
            if (contentPos < line.to) {
              widgets.push(Decoration.mark({
                class: "cm-task-content"
              }).range(contentPos, line.to));
            }
          }
        }
      }
    })
  }
  return Decoration.set(widgets)
}