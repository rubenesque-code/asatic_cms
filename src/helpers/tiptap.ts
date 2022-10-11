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

export const getFirstParagraph = (doc: JSONContent) => {
  const firstPara = doc?.content?.find((node) => node.type === "paragraph");

  return firstPara;
};

export const getFirstParagraphMergedPlainText = (doc: JSONContent) => {
  const firstPara = getFirstParagraph(doc);

  if (!firstPara?.content) {
    return null;
  }

  const plainText = firstPara.content
    .filter((node) => node.type === "text")
    .flatMap((node) => node.text)
    .join(" ");

  return plainText;
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

export const truncateJSONContent = (content: JSONContent, numChar: number) => {
  const text = getFirstParagraphMergedPlainText(content);

  if (!text) {
    return createTextDoc("");
  }

  const subStr = text.substring(0, numChar);
  const isEllipsis =
    subStr.substring(subStr.length - 3, subStr.length) === "...";
  const truncatedText = `${subStr}${
    isEllipsis || (subStr.length >= numChar && "...")
  }`;

  const truncated = createTextDoc(truncatedText);

  return truncated;
};

export const checDocHasTextContent = (doc: JSONContent) => {
  const hasText = doc?.content
    ?.find((node) => node.type === "paragraph")
    ?.content?.find((node) => node.type === "text")?.text?.length;

  return hasText;
};
