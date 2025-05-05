import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { codeBlockPlugin } from "./codeBlockPlugin"; // Assuming codeBlockPlugin is exported

describe("codeBlockPlugin", () => {
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

  test("should hide backticks and apply styling for a basic code block", async () => {
    // Make test async
    const doc = '```javascript\nconsole.log("hello");\n```';
    editorView = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [markdown(), codeBlockPlugin],
      }),
      parent: container,
    });

    await new Promise((resolve) => setTimeout(resolve, 50)); // Add a small delay

    // Check if the code block styling class is applied
    const codeBlockElement = container.querySelector(".cm-code-block");
    expect(codeBlockElement).not.toBeNull();

    // Check if the language class is applied
    const langElement = container.querySelector(".cm-code-lang");
    expect(langElement).not.toBeNull();
    expect(langElement?.textContent).toBe("javascript");

    // Check if the original backticks are hidden
    // This is tricky, but we can check the text content of the rendered view
    // It should not contain the backticks
    expect(container.textContent).not.toContain("```");
    expect(container.textContent).toContain('console.log("hello");');
  });

  // TODO: Add tests for code blocks without language specified
  // TODO: Add tests for empty code blocks
});
