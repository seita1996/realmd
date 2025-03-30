import CodeMirror, { keymap } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { syntaxHighlighting } from "@codemirror/language"
// import { useCallback } from "react";
import { underlineSelection } from "./lib/underlineSelection";
import { enlargeHeading, headingTheme, headingPlugin } from "./lib/enlargeHeading"
import { checkboxPlugin } from "./lib/checkbox";
import { bulletlistPlugin } from "./lib/bulletlist/bulletlistPlugin";
import { imagePlugin } from "./lib/image/imagePlugin";
import { codeBlockHighlighting, codeBlockTheme, codeBlockPlugin } from "./lib/code/codeBlockPlugin";
import { inlineCodeStyle, inlineCodeTheme, inlineCodePlugin } from "./lib/code/inlineCodePlugin";
import { blockquoteStyle, blockquoteTheme, blockquotePlugin } from "./lib/blockquote/blockquotePlugin";
import { linkStyle, linkTheme, linkPlugin } from "./lib/link/linkPlugin";
import { tableStyle, tableTheme, tablePlugin } from "./lib/table/tablePlugin";
import { markdownStyles, markdownTheme, formattingPlugin } from "./lib/markdown/markdownStyles";
import { orderedListTheme, orderedListPlugin } from "./lib/list/orderedListPlugin";
import { EditorView } from "@codemirror/view";

// 全体的なエディタスタイル（余白やスペースを調整）
const globalEditorTheme = EditorView.theme({
  "&": {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    lineHeight: "1.5",
    fontSize: "16px",
    color: "var(--ifm-font-color-base)",
    backgroundColor: "transparent",
  },
  ".cm-content": {
    padding: "8px",
    caretColor: "var(--ifm-font-color-base)"
  },
  ".cm-scroller": {
    overflow: "auto"
  }
});

export const Editor = (props: { text: string }) => {
  // const onChange = useCallback((val: string) =>{
  //   console.log(`val is\n`, val);
  // }, [])

  return (
    <>
      <CodeMirror
        value={`${props.text}`}
        theme="dark"
        basicSetup={{
          lineNumbers: false,  // 行番号を非表示
          foldGutter: false,   // 折りたたみを無効化
          highlightActiveLine: false, // アクティブ行のハイライトを無効化
          dropCursor: false,   // ドラッグ&ドロップのカーソルを無効化
        }}
        extensions={[
          markdown({ 
            base: markdownLanguage, 
            codeLanguages: languages,
            addKeymap: true // Enable keyboard shortcuts for markdown editing
          }),
          // Apply all markdown styling enhancements
          // syntaxHighlighting(enlargeHeading),
          syntaxHighlighting(codeBlockHighlighting),
          syntaxHighlighting(inlineCodeStyle),
          syntaxHighlighting(blockquoteStyle),
          syntaxHighlighting(linkStyle),
          syntaxHighlighting(tableStyle),
          // syntaxHighlighting(markdownStyles),
          
          // Apply themes
          globalEditorTheme,
          headingTheme,
          blockquoteTheme,
          linkTheme,
          tableTheme,
          markdownTheme,
          codeBlockTheme,
          inlineCodeTheme,
          orderedListTheme,
          
          // Add plugins that handle visual transformations
          headingPlugin,
          linkPlugin,
          codeBlockPlugin,
          inlineCodePlugin,
          blockquotePlugin,
          tablePlugin,
          formattingPlugin,
          orderedListPlugin,
          
          // Add existing plugins
          checkboxPlugin,
          bulletlistPlugin,
          imagePlugin,
          
          // Custom key bindings
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
