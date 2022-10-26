import { JSONContent } from "@tiptap/core";

import useTruncateTextEditorContent from "^hooks/useTruncateRichText";

import { getArticleSummaryFromTranslation } from "^helpers/article-like";

import { ArticleLikeTranslation } from "^types/article-like-entity";

import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

import { $Text } from "../_styles";

const ArticleLikeSummaryText_ = ({
  // authorsIds,
  translation,
  onUpdate,
}: {
  // authorsIds: string[];
  translation: ArticleLikeTranslation;
  onUpdate: (text: JSONContent) => void;
}) => {
  const summary =
    getArticleSummaryFromTranslation(translation, "user") || undefined;

  // const isAuthor = authorsIds.length;

  const { editorKey, truncated } = useTruncateTextEditorContent(summary);

  return (
    <$Text>
      <SimpleTipTapEditor
        initialContent={truncated || undefined}
        onUpdate={onUpdate}
        placeholder="Summary"
        key={editorKey}
      />
    </$Text>
  );
};

export default ArticleLikeSummaryText_;
