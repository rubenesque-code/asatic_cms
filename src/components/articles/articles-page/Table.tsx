import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import { Article as ArticleType } from "^types/article";

import { orderArticles } from "^helpers/article";

import TableUI, {
  s_table,
} from "^components/display-content-items-page/table/TableUI";
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import HandleDocAuthor from "^components/handle-doc-sub-doc/Authors";
import HandleDocCollection from "^components/handle-doc-sub-doc/Collection";
import HandleDocLanguage from "^components/handle-doc-sub-doc/Language";
import ListDocSubDocItemsUI from "^components/handle-doc-sub-doc/ListItemsUI";
import HandleDocSubject from "^components/handle-doc-sub-doc/Subject";
import HandleDocTag from "^components/handle-doc-sub-doc/Tag";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";
import useCreateAuthorsDisplayString from "^hooks/authors/useCreateDisplayString";
import useCreateSubjectsDisplayString from "^hooks/subjects/useCreateDisplayString";
import useCreateCollectionsDisplayString from "^hooks/collections/useCreateDisplayString";
import useCreateTagsDisplayString from "^hooks/tags/useCreateDisplayString";
import useCreateLanguagesDisplayString from "^hooks/translationLanguages/useCreateDisplayString";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );
  const articlesOrdered = orderArticles(articlesFiltered);

  return (
    <TableUI
      isFilter={isFilter}
      optionalColumns={["actions", "authors", "collections"]}
    >
      {articlesOrdered.map((article) => (
        <ArticleProviders article={article} key={article.id}>
          <RowCells />
        </ArticleProviders>
      ))}
    </TableUI>
  );
}

const ArticleProviders = ({
  article,
  children,
}: {
  article: ArticleType;
  children: ReactElement;
}) => {
  return (
    <ArticleSlice.Provider article={article}>
      {([{ id: articleId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <ArticleTranslationSlice.Provider
              articleId={articleId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </ArticleTranslationSlice.Provider>
          )}
        </DocLanguages.Provider>
      )}
    </ArticleSlice.Provider>
  );
};

const RowCells = () => {
  return (
    <>
      <TitleCell />
      <ActionsCell />
      <StatusCell />
      <AuthorsCell />
      <SubjectsCell />
      <CollectionsCell />
      <TagsCell />
      <LanguagesCell />
    </>
  );
};

const TitleCell = () => {
  const [{ status }] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();

  return (
    <TableUI.Cell>
      {title ? (
        <TableUI.TruncateString styles={tw`w-full`}>
          {title}
        </TableUI.TruncateString>
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </TableUI.Cell>
  );
};

const ActionsCell = () => {
  const [{ id }, { routeToEditPage }] = ArticleSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <TableUI.ActionsCell
      deleteDoc={() => deleteFromDb({ id, useToasts: true })}
      docType="article"
      routeToEditPage={routeToEditPage}
    />
  );
};

const StatusCell = () => {
  const [{ publishDate, status }] = ArticleSlice.useContext();

  return <TableUI.StatusCell publishDate={publishDate} status={status} />;
};

const AuthorsCell = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();
  const authorsStr = useCreateAuthorsDisplayString({
    activeLanguageId,
    authorsIds,
  });

  return (
    <TableUI.Cell>
      {authorsIds.length ? (
        <TableUI.TruncateEntities entitiesStr={authorsStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {authorsIds.map((authorId) => (
              <HandleDocAuthor
                docActiveLanguageId={activeLanguageId}
                authorId={authorId}
                key={authorId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const SubjectsCell = () => {
  const [{ subjectsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();
  const subjectsStr = useCreateSubjectsDisplayString({
    activeLanguageId,
    subjectsIds,
  });

  return (
    <TableUI.Cell>
      {subjectsIds.length ? (
        <TableUI.TruncateEntities entitiesStr={subjectsStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {subjectsIds.map((subjectId) => (
              <HandleDocSubject
                docActiveLanguageId={activeLanguageId}
                subjectId={subjectId}
                key={subjectId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const CollectionsCell = () => {
  const [{ collectionsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();
  const collectionsStr = useCreateCollectionsDisplayString({
    activeLanguageId,
    collectionsIds,
  });

  return (
    <TableUI.Cell>
      {collectionsIds.length ? (
        <TableUI.TruncateEntities entitiesStr={collectionsStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {collectionsIds.map((collectionId) => (
              <HandleDocCollection
                docActiveLanguageId={activeLanguageId}
                collectionId={collectionId}
                key={collectionId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const TagsCell = () => {
  const [{ tagsIds }] = ArticleSlice.useContext();
  const tagsStr = useCreateTagsDisplayString({ tagsIds });

  return (
    <TableUI.Cell>
      {tagsIds.length ? (
        <TableUI.TruncateEntities entitiesStr={tagsStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {tagsIds.map((tagId) => (
              <HandleDocTag tagId={tagId} key={tagId} />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const LanguagesCell = () => {
  const [{ languagesIds }] = ArticleSlice.useContext();
  const languagesStr = useCreateLanguagesDisplayString({ languagesIds });

  return (
    <TableUI.Cell>
      {languagesIds.length ? (
        <TableUI.TruncateEntities entitiesStr={languagesStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {languagesIds.map((languageId) => (
              <Language languageId={languageId} key={languageId} />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const Language = ({ languageId }: { languageId: string }) => {
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const isSelected = languageId === activeLanguageId;

  return (
    <WithTooltip
      text="click to show this translation"
      isDisabled={isSelected}
      type="action"
    >
      <button
        css={[isSelected && tw`border-b-2 border-green-active`]}
        onClick={() => setActiveLanguageId(languageId)}
        type="button"
      >
        <HandleDocLanguage languageId={languageId} />
      </button>
    </WithTooltip>
  );
};
