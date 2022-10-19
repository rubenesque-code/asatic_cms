import { JSONContent } from "@tiptap/core";

import useTruncateTextEditorContent from "^hooks/useTruncateTextEditorContent";

import { getArticleSummaryFromTranslation } from "^helpers/article-like";

import { ArticleLikeTranslation } from "^types/article-like-entity";

import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

import { $ArticleLikeSummaryText } from "../_styles";

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
    <$ArticleLikeSummaryText>
      <SimpleTipTapEditor
        initialContent={truncated || undefined}
        onUpdate={onUpdate}
        placeholder="Summary"
        key={editorKey}
      />
    </$ArticleLikeSummaryText>
  );
};

export default ArticleLikeSummaryText_;
