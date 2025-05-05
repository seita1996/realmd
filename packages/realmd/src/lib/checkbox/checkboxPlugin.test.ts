import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { toggleBoolean } from "./checkboxPlugin"; // Assuming toggleBoolean is exported

describe("toggleBoolean", () => {
  test("should toggle unchecked checkbox to checked", () => {
    const state = EditorState.create({
      doc: "- [ ] Task",
    });
    const view = new EditorView({ state });
    const pos = 4; // Position of the space in "[ ]"

    const toggled = toggleBoolean(view, pos);

    expect(toggled).toBe(true);
    expect(view.state.doc.toString()).toBe("- [x] Task");
  });

  test("should toggle checked checkbox to unchecked", () => {
    const state = EditorState.create({
      doc: "- [x] Task",
    });
    const view = new EditorView({ state });
    const pos = 4; // Position of 'x' in "[x]"

    const toggled = toggleBoolean(view, pos);

    expect(toggled).toBe(true);
    expect(view.state.doc.toString()).toBe("- [ ] Task");
  });

  test("should not toggle if not a checkbox", () => {
    const state = EditorState.create({
      doc: "Some text",
    });
    const view = new EditorView({ state });
    const pos = 5; // Position within "text"

    const toggled = toggleBoolean(view, pos);

    expect(toggled).toBe(false);
    expect(view.state.doc.toString()).toBe("Some text"); // Document should remain unchanged
  });
});
