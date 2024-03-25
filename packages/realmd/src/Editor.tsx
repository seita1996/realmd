import CodeMirror, { keymap } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import {syntaxHighlighting} from "@codemirror/language"
// import { useCallback } from "react";
import { underlineSelection } from "./lib/underlineSelection";
import { enlargeHeading } from "./lib/enlargeHeading"
import { checkboxPlugin } from "./lib/checkbox";
import { bulletlistPlugin } from "./lib/bulletlist/bulletlistPlugin";
import { imagePlugin } from "./lib/image/imagePlugin";

export const Editor = (props: { text: string }) => {
  // const onChange = useCallback((val: string) =>{
  //   console.log(`val is\n`, val);
  // }, [])

  return (
    <>
      <CodeMirror
        value={`${props.text}`}
        theme="dark"
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          syntaxHighlighting(enlargeHeading),
          checkboxPlugin,
          bulletlistPlugin,
          imagePlugin,
          keymap.of([
            {
              key: "Mod-h",
              preventDefault: true,
              run: underlineSelection
            }
          ])
        ]}
        // onChange={onChange}
      />
    </>
  )
}
