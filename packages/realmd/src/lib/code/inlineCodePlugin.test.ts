import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { inlineCodePlugin } from "./inlineCodePlugin"; // Assuming inlineCodePlugin is exported

describe("inlineCodePlugin", () => {
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

  test("should hide backticks and apply styling for inline code", async () => {
    // Make test async
    const doc = "This is `inline code`.";
    editorView = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [markdown(), inlineCodePlugin],
      }),
      parent: container,
    });

    await new Promise((resolve) => setTimeout(resolve, 50)); // Add a small delay

    // Check if the inline code styling class is applied
    const inlineCodeElement = container.querySelector(".cm-inline-code");
    expect(inlineCodeElement).not.toBeNull();

    // Check if the original backticks are hidden
    // This is tricky, but we can check the text content of the rendered view
    // It should not contain the backticks
    expect(container.textContent).not.toContain("`");
    expect(container.textContent).toContain("inline code");
  });

  // TODO: Add tests for inline code at the beginning/end of a line
  // TODO: Add tests for inline code with special characters
});
