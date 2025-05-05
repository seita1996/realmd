import { WidgetType } from "@codemirror/view";

export class BulletlistWidget extends WidgetType {
  constructor() {
    super();
  }

  toDOM() {
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cm-bulletlist";
    // wrap.appendChild(document.createElement("span"))
    const li = wrap.appendChild(document.createElement("span"));
    // Styles moved to custom.css
    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}
