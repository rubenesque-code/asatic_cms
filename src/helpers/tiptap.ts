import { JSONContent } from "@tiptap/core";

export type TipTapTextDoc = {
  type: "doc";
  content: { type: "paragraph"; content?: { type: "text"; text: string }[] }[];
};

export const checkDocHasTextContentOld = (doc: TipTapTextDoc) => {
  const docContent = doc.content;

  for (let i = 0; i < docContent.length; i++) {
    const paraNode = docContent[i];

    const paraNodeContent = paraNode?.content;

    if (!paraNodeContent) {
      return false;
    }

    for (let j = 0; j < paraNodeContent.length; j++) {
      const textNode = paraNodeContent[j];
      if (textNode.text.length) {
        return true;
      }
    }
  }

  return false;
};

export const getFirstParaTextFromDoc = (doc: TipTapTextDoc) => {
  const firstPara = doc.content[0];
  if (!firstPara.content) {
    return null;
  }
  const firstParaText = firstPara.content[0].text;

  return firstParaText.length ? firstParaText : null;
};

export const createTextDoc = (text: string) => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text,
        },
      ],
    },
  ],
});

export const truncateJSONContent = (
  content: JSONContent | null,
  numChar: number
) => {
  const text = content?.content
    ?.find((node) => node.type === "paragraph")
    ?.content?.find((node) => node.type === "text")?.text;

  const truncatedText = text ? `${text.substring(0, numChar)}...` : "";

  const truncated = createTextDoc(truncatedText);

  return truncated;
};

export const checDocHasTextContent = (doc: JSONContent) => {
  const hasText = doc?.content
    ?.find((node) => node.type === "paragraph")
    ?.content?.find((node) => node.type === "text")?.text?.length;

  return hasText;
};
