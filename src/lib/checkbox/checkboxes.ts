import {EditorView, Decoration} from "@codemirror/view"
import {syntaxTree} from "@codemirror/language"
import { CheckboxWidget } from "./checkboxWidget"
import { Range } from "@codemirror/state"

export function checkboxes(view: EditorView) {
  const widgets: Range<Decoration>[] = []
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (node.name == "TaskMarker") {
          const isTrue = view.state.doc.sliceString(node.from, node.to) == "[x]"
          const deco = Decoration.widget({
            widget: new CheckboxWidget(isTrue),
            side: 1
          })
          widgets.push(deco.range(node.to))
        }
      }
    })
  }
  return Decoration.set(widgets)
}