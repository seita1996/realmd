import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { orderedListPlugin } from "./orderedListPlugin"; // Assuming orderedListPlugin is exported

describe("orderedListPlugin", () => {
  let editorView: EditorView;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    editorView.destroy();
    document.body.removeChild(container);
  });

  test("should hide the number marker for a basic ordered list item", () => {
    const doc = "1. First item";
    editorView = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [markdown(), orderedListPlugin],
      }),
      parent: container,
    });

    // Check if the original number marker is hidden
    // This is tricky with decorations, but we can check if the text content in the view does not include the marker
    // Or check for the presence of the applied class and absence of the original text node
    const lineElement = container.querySelector(".cm-line");
    expect(lineElement).not.toBeNull();
    // A simple check: the line text content in the rendered view should not start with "1."
    // This might not be perfectly accurate depending on how decorations are applied,
    // but serves as a basic check.
    expect(lineElement?.textContent).not.toMatch(/^1\.\s/);

    // Check for the presence of the ordered list item class
    expect(lineElement?.querySelector(".cm-ordered-list-item")).not.toBeNull();
  });

  // TODO: Add tests for nested ordered lists (checking different list styles and indentation)
  // TODO: Add tests for ordered lists starting with a number other than 1
});
