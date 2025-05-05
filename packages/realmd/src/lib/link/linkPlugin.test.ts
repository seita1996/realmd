import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { linkPlugin } from "./linkPlugin"; // Assuming linkPlugin is exported

describe("linkPlugin", () => {
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

  test("should render a link widget for a valid markdown link", () => {
    const doc = "[Example Link](https://example.com)";
    editorView = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [markdown(), linkPlugin],
      }),
      parent: container,
    });

    // Check if an anchor element is created in the DOM
    const linkElement = container.querySelector("a");
    expect(linkElement).not.toBeNull();
    expect(linkElement?.textContent).toBe("Example Link");
    expect(linkElement?.href).toBe("https://example.com/"); // JSDOM might normalize URL
    expect(linkElement?.target).toBe("_blank");
  });

  // TODO: Add tests for different link syntaxes (e.g., with title)
  // TODO: Add tests for invalid links
});
