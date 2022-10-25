import { JSONContent } from "@tiptap/core";

import { ArticleLikeTranslation } from "^types/article-like-entity";
import { getArticleSummaryFromTranslation } from "^helpers/article-like";
import useTruncateTextEditorContent from "^hooks/useTruncateTextEditorContent";

import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

export function Text_<TTranslation extends ArticleLikeTranslation>({
  translation,
  updateDocCollectionSummary,
}: {
  translation: TTranslation;
  updateDocCollectionSummary: (summary: JSONContent) => void;
}) {
  const summary = getArticleSummaryFromTranslation(translation, "collection");

  const { editorKey, truncated } = useTruncateTextEditorContent(summary);

  return (
    <SimpleTipTapEditor
      initialContent={truncated || undefined}
      onUpdate={updateDocCollectionSummary}
      placeholder="Summary"
      key={editorKey}
    />
  );
}
