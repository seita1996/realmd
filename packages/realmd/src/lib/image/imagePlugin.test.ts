import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view"; // Import lineNumbers
import { history } from "@codemirror/commands"; // Import history
import { markdown } from "@codemirror/lang-markdown";
import { imagePlugin } from "./imagePlugin"; // Assuming imagePlugin is exported

describe("imagePlugin", () => {
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

  test("should render an image widget for a valid image markdown", () => {
    const doc = "![alt text](https://example.com/image.png)";
    editorView = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [
          lineNumbers(), // Use lineNumbers extension
          history(), // Use history extension
          markdown(),
          imagePlugin,
        ],
      }),
      parent: container,
    });

    // Check if an image element is created in the DOM
    const imgElement = container.querySelector("img");
    expect(imgElement).not.toBeNull();
    expect(imgElement?.src).toBe("https://example.com/image.png");
    expect(imgElement?.alt).toBe("alt text");
  });

  // TODO: Add tests for error handling (broken image link)
  // TODO: Add tests for different image markdown syntaxes
});
