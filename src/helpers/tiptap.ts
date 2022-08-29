export type TipTapTextDoc = {
  type: "doc";
  content: { type: "paragraph"; content: { type: "text"; text: string }[] }[];
};

export const checkDocHasTextContent = (doc: TipTapTextDoc) => {
  const docContent = doc.content;

  for (let i = 0; i < docContent.length; i++) {
    const paraNode = docContent[i];

    const paraNodeContent = paraNode.content;
    for (let j = 0; j < paraNodeContent.length; j++) {
      const textNode = paraNodeContent[j];
      if (textNode.text.length) {
        return true;
      }
    }
  }

  return false;
};
