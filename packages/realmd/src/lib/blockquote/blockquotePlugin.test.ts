import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { blockquotePlugin } from "./blockquotePlugin"; // Assuming blockquotePlugin is exported

describe("blockquotePlugin", () => {
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

  test("should hide the blockquote marker and apply styling", () => {
    const doc = "> This is a blockquote.";
    editorView = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [markdown(), blockquotePlugin],
      }),
      parent: container,
    });

    // Check if the blockquote styling class is applied
    const blockquoteElement = container.querySelector(".cm-blockquote");
    expect(blockquoteElement).not.toBeNull();

    // Check if the original marker is hidden (basic check)
    expect(container.textContent).not.toContain(">");
    expect(container.textContent).toContain("This is a blockquote.");
  });

  // TODO: Add tests for multi-line blockquotes
  // TODO: Add tests for nested blockquotes
});
