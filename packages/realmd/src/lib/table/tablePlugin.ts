import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

// Style for tables in markdown
export const tableStyle = HighlightStyle.define([
  { tag: tags.heading, fontWeight: "bold" } // This will affect table headers too
]);

// Theme for table styling
export const tableTheme = EditorView.baseTheme({
  ".cm-table-container": {
    display: "block",
    width: "100%",
    overflowX: "auto",
    margin: "1em 0",
    borderCollapse: "collapse"
  },
  ".cm-table": {
    borderCollapse: "collapse",
    width: "100%",
    border: "1px solid #555",
    fontSize: "0.95em",
    fontFamily: "inherit",
    margin: "0"
  },
  ".cm-table-row": {
    borderBottom: "1px solid #555",
    display: "table-row"
  },
  ".cm-table-cell": {
    padding: "8px 12px",
    borderRight: "1px solid #555",
    display: "table-cell",
    textAlign: "left"
  },
  ".cm-table-cell-center": {
    textAlign: "center"
  },
  ".cm-table-cell-right": {
    textAlign: "right"
  },
  ".cm-table-header": {
    fontWeight: "bold",
    borderBottom: "2px solid #555",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    display: "table-cell",
    padding: "8px 12px",
    textAlign: "left"
  },
  ".cm-table-header-center": {
    textAlign: "center"
  },
  ".cm-table-header-right": {
    textAlign: "right"
  }
});

// Improved table plugin to handle tables correctly
export const tablePlugin = ViewPlugin.fromClass(class {
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

    // Track tables in progress
    let tableStartLine = -1;
    let tableEndLine = -1;
    let headerSeparatorLine = -1;
    let alignments: ('left' | 'center' | 'right')[] = [];

    // Process each visible line to find tables
    for (let i = 1; i <= state.doc.lines; i++) {
      const line = state.doc.line(i);
      const text = line.text.trim();

      // Check if line is a table row (starts and ends with |)
      if (text.startsWith('|') && text.endsWith('|')) {
        // Start of a new table
        if (tableStartLine === -1) {
          tableStartLine = i;
        }
        
        // Check if this line is the separator row (contains only |, -, :)
        const isSeparator = /^\|[\s\-:\|]+\|$/.test(text);
        if (isSeparator && headerSeparatorLine === -1) {
          headerSeparatorLine = i;
          
          // Extract alignment information from separator
          const cells = text.split('|').filter(Boolean).map(cell => cell.trim());
          alignments = cells.map(cell => {
            if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
            if (cell.endsWith(':')) return 'right';
            return 'left';
          });
        }
        
        tableEndLine = i;
      }
      // Line is not part of the table, process the previously found table
      else if (tableStartLine !== -1) {
        this.processTable(decorations, state, tableStartLine, tableEndLine, headerSeparatorLine, alignments);
        
        // Reset table tracking
        tableStartLine = -1;
        tableEndLine = -1;
        headerSeparatorLine = -1;
        alignments = [];
      }
    }
    
    // Process the last table if there is one
    if (tableStartLine !== -1) {
      this.processTable(decorations, state, tableStartLine, tableEndLine, headerSeparatorLine, alignments);
    }

    return Decoration.set(decorations);
  }

  processTable(
    decorations: Range<Decoration>[], 
    state: EditorView['state'], 
    startLine: number, 
    endLine: number, 
    headerLine: number,
    alignments: ('left' | 'center' | 'right')[]
  ) {
    if (startLine > endLine || headerLine <= startLine || headerLine >= endLine) {
      return; // Invalid table structure
    }

    const tableStartPos = state.doc.line(startLine).from;
    const tableEndPos = state.doc.line(endLine).to;
    
    // Add a container for the entire table
    const tableWidget = document.createElement('div');
    tableWidget.className = 'cm-table-container';
    
    // Create actual table element
    const table = document.createElement('table');
    table.className = 'cm-table';
    tableWidget.appendChild(table);
    
    decorations.push(Decoration.widget({
      widget: {
        toDOM: () => tableWidget,
        eq: () => false,
        ignoreEvent: () => false,
        updateDOM: () => false,
        estimatedHeight: 0,
        lineBreaks: 0,
        coordsAt: () => null,
        destroy: () => {}
      },
      side: -1
    }).range(tableStartPos));
    
    // Add a span to wrap all the table content
    decorations.push(Decoration.mark({
      class: "cm-table-wrapper"
    }).range(tableStartPos, tableEndPos));
    
    // Process each row of the table
    for (let i = startLine; i <= endLine; i++) {
      if (i === headerLine) continue; // Skip the separator line
      
      const line = state.doc.line(i);
      const text = line.text.trim();
      
      // Parse the table row
      const cells = text.split('|').filter((cell, index) => 
        // Skip first and last empty cells if they exist
        !(index === 0 && cell.trim() === '') && 
        !(index === text.split('|').length - 1 && cell.trim() === '')
      );
      
      const isHeader = i < headerLine;
      
      // Style each row
      decorations.push(Decoration.mark({
        class: "cm-table-row"
      }).range(line.from, line.to));
      
      // Apply cell styling
      let currentPos = line.text.indexOf('|') + 1 + line.from;
      
      for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cell = cells[cellIndex].trim();
        
        // Find the cell boundaries
        const cellEnd = line.text.indexOf('|', currentPos - line.from);
        if (cellEnd === -1) break;
        
        const cellStart = currentPos;
        const cellEndPos = line.from + cellEnd;
        
        // Get alignment for this cell
        const alignment = alignments[cellIndex] || 'left';
        const alignClass = alignment === 'center' ? '-center' : alignment === 'right' ? '-right' : '';
        
        // Apply cell styling based on whether it's a header or regular cell
        const cellClass = isHeader 
          ? `cm-table-header${alignClass}` 
          : `cm-table-cell${alignClass}`;
          
        decorations.push(Decoration.mark({
          class: cellClass
        }).range(cellStart, cellEndPos));
        
        currentPos = cellEndPos + 1;
      }
    }
    
    // Replace the entire table with our styled version
    decorations.push(Decoration.replace({}).range(tableStartPos, tableEndPos));
  }
}, {
  decorations: v => v.decorations
});