import {
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { images } from "./images";

export const imagePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = images(view);
    }

    update(viewUpdate: ViewUpdate) {
      if (viewUpdate.docChanged || viewUpdate.viewportChanged) {
        this.decorations = images(viewUpdate.view);
      }
    }
  }, {
    decorations: (plugin) => plugin.decorations
  }
);
