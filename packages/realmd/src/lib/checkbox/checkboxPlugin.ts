import {
  ViewUpdate,
  ViewPlugin,
  DecorationSet,
  EditorView,
} from "@codemirror/view";
import { checkboxes } from "./checkboxes";

export const checkboxPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = checkboxes(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged)
        this.decorations = checkboxes(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,

    eventHandlers: {
      mousedown: (e, view) => {
        const target = e.target as HTMLElement;
        if (
          target.nodeName == "INPUT" &&
          target.parentElement!.classList.contains("cm-boolean-toggle")
        )
          return toggleBoolean(view, view.posAtDOM(target));
      },
      keydown: (e, view) => {
        const target = e.target as HTMLElement;
        if (
          e.key === " " &&
          target.nodeName === "INPUT" &&
          target.parentElement!.classList.contains("cm-boolean-toggle")
        ) {
          e.preventDefault(); // Prevent default space key behavior (scrolling)
          return toggleBoolean(view, view.posAtDOM(target));
        }
        return false;
      },
    },
  },
);

function toggleBoolean(view: EditorView, pos: number) {
  const before = view.state.doc.sliceString(Math.max(0, pos - 3), pos);
  let change;
  if (before == "[ ]") change = { from: pos - 3, to: pos, insert: "[x]" };
  else if (before == "[x]") change = { from: pos - 3, to: pos, insert: "[ ]" };
  else return false;
  view.dispatch({ changes: change });
  return true;
}

export { toggleBoolean };
