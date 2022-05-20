import { NextPage } from "next";
import Markdown from "markdown-to-jsx";
import React, { useMemo } from "react";
// Option 1: Browser + server-side
// import { generateHTML } from "@tiptap/html";
// Option 2: Browser-only (lightweight)
import { generateHTML } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";

const json = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Example ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Text",
        },
      ],
    },
  ],
};

const Test: NextPage = () => {
  const output = useMemo(() => {
    return generateHTML(json, [
      Document,
      Paragraph,
      Text,
      Bold,
      // other extensions …
    ]);
  }, [json]);
  console.log(typeof output);

  return <Markdown>{output}</Markdown>;
};

export default Test;
