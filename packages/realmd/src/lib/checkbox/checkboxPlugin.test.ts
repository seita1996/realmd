import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language"; // Import syntaxTree
import { markdown } from "@codemirror/lang-markdown"; // Import markdown language support
import { toggleBoolean } from "./checkboxPlugin"; // Assuming toggleBoolean is exported

describe("toggleBoolean", () => {
  test("should toggle unchecked checkbox to checked", () => {
    const doc = "- [ ] Task";
    const state = EditorState.create({
      doc,
      extensions: [markdown()], // Add markdown language support
    });
    const view = new EditorView({ state });

    // Find the position of the state character (' ' or 'x') using regex
    const match = doc.match(/- \[( |x)\]/);
    let togglePos = -1;
    if (match && match[0]) {
      togglePos = match.index! + "- [".length; // Position after "- ["
    }

    console.log(`Toggle position: ${togglePos}`);
    console.log(
      `String around toggle position: "${view.state.doc.sliceString(Math.max(0, togglePos - 5), togglePos + 5)}"`,
    );

    const toggled = toggleBoolean(view, togglePos); // Pass the position of the state character (' ' or 'x')

    expect(toggled).toBe(true);
    expect(view.state.doc.toString()).toBe("- [x] Task");
  });

  test("should toggle checked checkbox to unchecked", () => {
    const doc = "- [x] Task";
    const state = EditorState.create({
      doc,
      extensions: [markdown()], // Add markdown language support
    });
    const view = new EditorView({ state });

    // Find the position of the state character (' ' or 'x') using regex
    const match = doc.match(/- \[( |x)\]/);
    let togglePos = -1;
    if (match && match[0]) {
      togglePos = match.index! + "- [".length; // Position after "- ["
    }

    console.log(`Toggle position: ${togglePos}`);
    console.log(
      `String around toggle position: "${view.state.doc.sliceString(Math.max(0, togglePos - 5), togglePos + 5)}"`,
    );

    const toggled = toggleBoolean(view, togglePos); // Pass the position of the state character (' ' or 'x')

    expect(toggled).toBe(true);
    expect(view.state.doc.toString()).toBe("- [ ] Task");
  });

  test("should not toggle if not a checkbox", () => {
    const doc = "Some text";
    const state = EditorState.create({
      doc,
      extensions: [markdown()], // Add markdown language support
    });
    const view = new EditorView({ state });
    const pos = 5; // Position within "text"

    const toggled = toggleBoolean(view, pos);

    expect(toggled).toBe(false);
    expect(view.state.doc.toString()).toBe("Some text"); // Document should remain unchanged
  });
});
