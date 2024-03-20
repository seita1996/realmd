import {Decoration, MatchDecorator} from "@codemirror/view"
import { BulletlistWidget } from "./bulletlistWidget"

export const bulletlistMatcher = new MatchDecorator({
  regexp: /- (?!\[)/g, // Pattern matching on Bulletlist only
  decoration: () => Decoration.replace({
    widget: new BulletlistWidget()
  })
})