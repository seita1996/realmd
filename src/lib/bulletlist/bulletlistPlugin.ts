import {ViewUpdate, ViewPlugin, DecorationSet, EditorView} from "@codemirror/view"
import { bulletlistMatcher } from "./bulletlistMatcher"

export const bulletlistPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = bulletlistMatcher.createDeco(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged)
      this.decorations = bulletlistMatcher.updateDeco(update, this.decorations)
  }
}, {
  decorations: v => v.decorations,
})
