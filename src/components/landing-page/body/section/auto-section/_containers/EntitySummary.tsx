import { JSONContent } from "@tiptap/core";
import { ComponentProps } from "react";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import { getArticleSummaryFromTranslation } from "^helpers/article-like";
import useTruncateTextEditorContent from "^hooks/useTruncateTextEditorContent";
import { ArticleLikeTranslation } from "^types/article-like-entity";

import { $Title, $Authors, $Text } from "../_styles/entitySummary";

export const Title_ = ({ title }: { title: string | undefined }) => {
  const isTitle = Boolean(title?.length);

  return (
    <$Title color="cream" isTitle={isTitle}>
      {isTitle ? title : "Title"}
    </$Title>
  );
};

export const Authors_ = (props: ComponentProps<typeof DocAuthorsText>) => {
  if (!props.authorIds.length) {
    return null;
  }

  return (
    <$Authors>
      <DocAuthorsText {...props} />
    </$Authors>
  );
};

// todo: collection will use this?
export function Text_<TTranslation extends ArticleLikeTranslation>({
  translation,
  updateEntityAutoSectionSummary,
}: {
  translation: TTranslation;
  updateEntityAutoSectionSummary: (summary: JSONContent) => void;
}) {
  const summary = getArticleSummaryFromTranslation(translation, "collection");

  const { editorKey, truncated } = useTruncateTextEditorContent(summary);

  return (
    <$Text>
      <SimpleTipTapEditor
        placeholder="Summary"
        initialContent={truncated}
        onUpdate={updateEntityAutoSectionSummary}
        key={editorKey}
      />
    </$Text>
  );
}
