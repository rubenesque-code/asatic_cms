import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectBlogsByLanguageAndQuery } from "^redux/state/complex-selectors/blogs";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import { Blog as BlogType } from "^types/blog";

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

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const blogsFiltered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <TableUI isFilter={isFilter} optionalColumns={["authors", "collections"]}>
      {blogsFiltered.map((blog) => (
        <BlogProviders blog={blog} key={blog.id}>
          <RowCells />
        </BlogProviders>
      ))}
    </TableUI>
  );
}

const BlogProviders = ({
  blog,
  children,
}: {
  blog: BlogType;
  children: ReactElement;
}) => {
  return (
    <BlogSlice.Provider blog={blog}>
      {([{ id: blogId, languagesIds, translations }]) => (
        <DocLanguages.SelectProvider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <BlogTranslationSlice.Provider
              blogId={blogId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </BlogTranslationSlice.Provider>
          )}
        </DocLanguages.SelectProvider>
      )}
    </BlogSlice.Provider>
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
  const [{ status }] = BlogSlice.useContext();
  const [{ title }] = BlogTranslationSlice.useContext();

  return (
    <TableUI.Cell>
      {title ? (
        title
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </TableUI.Cell>
  );
};

const ActionsCell = () => {
  const [{ id }, { routeToEditPage }] = BlogSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <TableUI.ActionsCell
      deleteDoc={() => deleteFromDb({ id, useToasts: true })}
      docType="blog"
      routeToEditPage={routeToEditPage}
    />
  );
};

const StatusCell = () => {
  const [{ publishDate, status }] = BlogSlice.useContext();

  return <TableUI.StatusCell publishDate={publishDate} status={status} />;
};

const AuthorsCell = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  return (
    <TableUI.Cell>
      {authorsIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {authorsIds.map((authorId) => (
            <HandleDocAuthor
              docActiveLanguageId={activeLanguageId}
              authorId={authorId}
              key={authorId}
            />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const SubjectsCell = () => {
  const [{ subjectsIds }] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  return (
    <TableUI.Cell>
      {subjectsIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {subjectsIds.map((subjectId) => (
            <HandleDocSubject
              docActiveLanguageId={activeLanguageId}
              subjectId={subjectId}
              key={subjectId}
            />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const CollectionsCell = () => {
  const [{ collectionsIds }] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  return (
    <TableUI.Cell>
      {collectionsIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {collectionsIds.map((collectionId) => (
            <HandleDocCollection
              docActiveLanguageId={activeLanguageId}
              collectionId={collectionId}
              key={collectionId}
            />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const TagsCell = () => {
  const [{ tagsIds }] = BlogSlice.useContext();

  return (
    <TableUI.Cell>
      {tagsIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {tagsIds.map((tagId) => (
            <HandleDocTag tagId={tagId} key={tagId} />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const LanguagesCell = () => {
  const [{ languagesIds }] = BlogSlice.useContext();

  return (
    <TableUI.Cell>
      {languagesIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {languagesIds.map((languageId) => (
            <Language languageId={languageId} key={languageId} />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const Language = ({ languageId }: { languageId: string }) => {
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useSelectContext();

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
