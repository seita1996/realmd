import {WidgetType} from "@codemirror/view"

export class BulletlistWidget extends WidgetType {
  constructor() {
    super()
  }

  toDOM() {
    const wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.className = "cm-bulletlist"
    // wrap.appendChild(document.createElement("span"))
    const li = wrap.appendChild(document.createElement("span"))
    li.style.display = 'inline-block'
    li.style.width = '3px'
    li.style.height = '3px'
    li.style.borderRadius = '50%'
    li.style.backgroundColor = 'currentColor'
    li.style.marginRight = '1em'
    li.style.marginBottom = '3px'
    return wrap
  }

  ignoreEvent() { return false }
}
