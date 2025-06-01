"use client";

import "./dark-editor.css";
import "@mdxeditor/editor/style.css";
import type { ForwardedRef } from "react";

import {
  type MDXEditorMethods,
  type MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  toolbarPlugin,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";

interface Props extends Omit<MDXEditorProps, "markdown"> {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  value: string;
  fieldChange: (value: string) => void;
}

const Editor = ({ value, editorRef, fieldChange, ...props }: Props) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            txt: "txt",
            sql: "sql",
            html: "html",
            saas: "saas",
            scss: "scss",
            bash: "bash",
            json: "json",
            js: "javascript",
            ts: "typescript",
            "": "unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />

                      <BoldItalicUnderlineToggles />
                      <Separator />

                      <ListsToggle />
                      <Separator />

                      <CreateLink />
                      <InsertImage />
                      <Separator />

                      <InsertTable />
                      <InsertThematicBreak />

                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full
        border"
      onChange={fieldChange}
      ref={editorRef}
      {...props}
    />
  );
};

export default Editor;
