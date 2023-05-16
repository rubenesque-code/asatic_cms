import AuthorSlice from "^context/authors/AuthorContext";
import { useSelector } from "^redux/hooks";
import { selectArticlesByIds } from "^redux/state/articles";
import { selectBlogsByIds } from "^redux/state/blogs";
import { selectRecordedEventsByIds } from "^redux/state/recordedEvents";
import { AuthorTranslation } from "^types/author";

export const useIsAuthorTranslationUsed = (
  translation: AuthorTranslation
): boolean => {
  const [{ articlesIds, blogsIds, recordedEventsIds }] =
    AuthorSlice.useContext();

  const isAuthorTranslationUsed = useSelector((state) => {
    const articles = selectArticlesByIds(state, articlesIds).flatMap((e) =>
      e ? [e] : []
    );
    const blogs = selectBlogsByIds(state, blogsIds).flatMap((e) =>
      e ? [e] : []
    );
    const recordedEvents = selectRecordedEventsByIds(
      state,
      recordedEventsIds
    ).flatMap((e) => (e ? [e] : []));

    const relatedEntitiesLanguageIds = [
      ...articles,
      ...blogs,
      ...recordedEvents,
    ].flatMap((e) => e.translations.flatMap((t) => t.languageId));

    return relatedEntitiesLanguageIds.includes(translation.languageId);
  });

  return isAuthorTranslationUsed;
};
