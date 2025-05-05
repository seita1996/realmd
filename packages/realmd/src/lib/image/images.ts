import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";
import { Decoration, EditorView } from "@codemirror/view";
import { ImageWidget } from "./imageWidget"; // Assuming ImageWidgetParams is defined here

const imageRegex = /!\[(?<alt>.*)\]\((?<url>.*)\)/; // Capture alt text

// imageDecoration now expects url and alt
const imageDecoration = ({
  url,
  alt,
  view,
}: {
  url: string;
  alt: string;
  view: EditorView;
}) =>
  Decoration.widget({
    widget: new ImageWidget({ url, alt, view }), // Pass alt to ImageWidget
    side: -1,
  });

export function images(view: EditorView) {
  const widgets: Range<Decoration>[] = [];

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.name === "Image") {
          const result = imageRegex.exec(
            view.state.doc.sliceString(node.from, node.to),
          );

          if (
            result &&
            result.groups &&
            result.groups.url &&
            result.groups.alt !== undefined
          ) {
            // Check for alt group
            widgets.push(
              imageDecoration({
                url: result.groups.url,
                alt: result.groups.alt,
                view,
              }).range(
                // Pass alt
                node.to,
              ),
            );
          }
        }
      },
    });
  }
  return Decoration.set(widgets);
}
