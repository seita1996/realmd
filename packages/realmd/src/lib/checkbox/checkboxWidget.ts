import {WidgetType} from "@codemirror/view"

export class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean) { super() }

  eq(other: CheckboxWidget) { return other.checked == this.checked }

  toDOM() {
    const wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-boolean-toggle"
    const box = wrap.appendChild(document.createElement("input"))
    box.type = "checkbox"
    box.checked = this.checked
    return wrap
  }

  ignoreEvent() { return false }
}