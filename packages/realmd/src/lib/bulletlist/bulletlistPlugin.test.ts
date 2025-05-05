import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { bulletlistPlugin } from "./bulletlistPlugin"; // Assuming bulletlistPlugin is exported

describe("bulletlistPlugin", () => {
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

  test("should render a bullet list widget for a markdown list item", () => {
    const doc = "- List item";
    editorView = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [markdown(), bulletlistPlugin],
      }),
      parent: container,
    });

    // Check if the bullet list widget element is created in the DOM
    const bulletElement = container.querySelector(".cm-bulletlist");
    expect(bulletElement).not.toBeNull();
    // Further checks can be added here to verify the widget's structure or content
  });

  // TODO: Add tests for nested lists
  // TODO: Add tests for different bullet markers (*, +) if supported
});
