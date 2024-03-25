import {tags} from "@lezer/highlight"
import {HighlightStyle} from "@codemirror/language"

export const enlargeHeading = HighlightStyle.define([
  {tag: tags.heading1, fontSize: "2em"},
  {tag: tags.heading2, fontSize: "1.5em"},
  {tag: tags.heading3, fontSize: "1.2em"},
  {tag: tags.monospace, backgroundColor: "var(--hybrid-mde-images-bg-color, rgba(0, 0, 0, 0.3))"}
])