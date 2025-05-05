import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import {
  EditorView,
  Decoration,
  DecorationSet,
  ViewPlugin,
  ViewUpdate,
  WidgetType, // Import WidgetType
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

// Style for tables in markdown
export const tableStyle = HighlightStyle.define([
  { tag: tags.heading, fontWeight: "bold" }, // This will affect table headers too
]);

// Theme for table styling
export const tableTheme = EditorView.baseTheme({
  ".cm-table-container": {
    display: "block",
    width: "100%",
    overflowX: "auto",
    margin: "1em 0",
    borderCollapse: "collapse",
  },
  ".cm-table": {
    borderCollapse: "collapse",
    width: "100%",
    border: "1px solid #555",
    fontSize: "0.95em",
    fontFamily: "inherit",
    margin: "0",
  },
  ".cm-table-row": {
    borderBottom: "1px solid #555",
    display: "table-row",
  },
  ".cm-table-cell": {
    padding: "8px 12px",
    borderRight: "1px solid #555",
    display: "table-cell",
    textAlign: "left",
  },
  ".cm-table-cell-center": {
    textAlign: "center",
  },
  ".cm-table-cell-right": {
    textAlign: "right",
  },
  ".cm-table-header": {
    fontWeight: "bold",
    borderBottom: "2px solid #555",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    display: "table-cell",
    padding: "8px 12px",
    textAlign: "left",
  },
  ".cm-table-header-center": {
    textAlign: "center",
  },
  ".cm-table-header-right": {
    textAlign: "right",
  },
});

// Widget to render the table DOM structure
class TableWidget extends WidgetType {
  constructor(readonly tableText: string) {
    super();
  }

  eq(other: TableWidget) {
    return other.tableText === this.tableText;
  }

  toDOM() {
    const container = document.createElement("div");
    container.className = "cm-table-container";

    const table = document.createElement("table");
    table.className = "cm-table";
    container.appendChild(table);

    const lines = this.tableText.trim().split("\n");
    let isHeaderRow = true;
    let alignments: ("left" | "center" | "right")[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith("|") || !trimmedLine.endsWith("|")) continue;

      const cells = trimmedLine
        .split("|")
        .filter(
          (cell, index, arr) =>
            // Filter out empty strings from split, but keep first/last if they are not empty
            cell !== "" || index === 0 || index === arr.length - 1,
        )
        .map((cell) => cell.trim());

      if (cells.length === 0) continue;

      // Check if this is the separator line
      const isSeparator = cells.every((cell) => /^[\s\-:]*$/.test(cell));

      if (isSeparator) {
        isHeaderRow = false; // The next row will be data
        // Parse alignments from the separator line
        alignments = cells.map((cell) => {
          if (cell.startsWith(":") && cell.endsWith(":")) return "center";
          if (cell.endsWith(":")) return "right";
          return "left";
        });
        continue; // Skip rendering the separator line
      }

      const rowElement = document.createElement("tr");
      rowElement.className = "cm-table-row";
      table.appendChild(rowElement);

      cells.forEach((cellText, cellIndex) => {
        const cellElement = document.createElement(isHeaderRow ? "th" : "td");
        const alignClass =
          alignments[cellIndex] === "center"
            ? "-center"
            : alignments[cellIndex] === "right"
              ? "-right"
              : "";
        cellElement.className = isHeaderRow
          ? `cm-table-header${alignClass}`
          : `cm-table-cell${alignClass}`;
        cellElement.textContent = cellText;
        rowElement.appendChild(cellElement);
      });
    }

    return container;
  }

  ignoreEvent() {
    return false;
  }
}

// Plugin to hide markdown table syntax and replace with rendered table
export const tablePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.createDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.createDecorations(update.view);
      }
    }

    createDecorations(view: EditorView) {
      const decorations: Range<Decoration>[] = [];
      const { state } = view;

      syntaxTree(state).iterate({
        enter: (node) => {
          const type = node.type;
          if (type.name === "Table") {
            const tableText = state.doc.sliceString(node.from, node.to);

            // Replace the entire table range with a widget
            decorations.push(
              Decoration.replace({
                widget: new TableWidget(tableText), // Use the new TableWidget
                inclusive: true,
              }).range(node.from, node.to),
            );
          }
        },
      });

      // Sort decorations by from position and startSide
      decorations.sort((a, b) => {
        if (a.from !== b.from) return a.from - b.from;
        return a.value.startSide - b.value.startSide;
      });

      return Decoration.set(decorations);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);
