import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";
import {
  Decoration,
  EditorView,
} from "@codemirror/view";
import { ImageWidget } from './imageWidget'

const imageRegex = /!\[.*\]\((?<url>.*)\)/;

interface ImageWidgetParams {
  url: string;
  view: EditorView;
}

const imageDecoration = (imageWidgetParams: ImageWidgetParams) =>
  Decoration.widget({
    widget: new ImageWidget(imageWidgetParams),
    side: -1
  });

export function images(view: EditorView) {
  const widgets: Range<Decoration>[] = [];

  for (const { from, to } of view.visibleRanges) {

    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (node.name === "Image") {
          const result = imageRegex.exec(
            view.state.doc.sliceString(node.from, node.to)
          );

          if (result && result.groups && result.groups.url) {
            widgets.push(
              imageDecoration({ url: result.groups.url, view }).range(
                node.to
              )
            );
          }
        }
      },
    });
  }
  return Decoration.set(widgets);
}