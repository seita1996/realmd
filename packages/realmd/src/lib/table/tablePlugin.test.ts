import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { tablePlugin } from "./tablePlugin"; // Assuming tablePlugin is exported

describe("tablePlugin", () => {
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

  // TODO: delete this skip
  test.skip("should render a basic table with correct structure and styling", async () => {
    const doc = "| Header 1 | Header 2 |\n|---|---|\n| Cell 1 | Cell 2 |";
    editorView = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [markdown(), tablePlugin],
      }),
      parent: container,
    });

    await new Promise((resolve) => setTimeout(resolve, 50)); // Add a small delay

    // Check if the table container element is created
    const tableContainer = container.querySelector(".cm-table-container");
    expect(tableContainer).not.toBeNull();

    // Check if the table element is created within the container
    const tableElement = tableContainer?.querySelector(".cm-table");
    expect(tableElement).not.toBeNull();

    // Check for header row and cells
    const headerCells = tableElement?.querySelectorAll(".cm-table-header");
    expect(headerCells?.length).toBe(2);
    expect(headerCells?.[0]?.textContent).toBe("Header 1");
    expect(headerCells?.[1]?.textContent).toBe("Header 2");

    const dataCells = tableElement?.querySelectorAll(".cm-table-cell");
    expect(dataCells?.length).toBe(2);
    expect(dataCells?.[0]?.textContent).toBe("Cell 1");
    expect(dataCells?.[1]?.textContent).toBe("Cell 2");

    // Check if original markdown text is hidden (basic check)
    expect(container.textContent).not.toContain("|");
    expect(container.textContent).not.toContain("---");
  });

  // TODO: Add tests for tables with different alignments
  // TODO: Add tests for tables with multiple rows and columns
  // TODO: Add tests for tables with special characters in cells
});
