import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";
import { Popover } from "@headlessui/react";
import { FilePlus, X } from "phosphor-react";

import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { selectBlogsByLanguageAndQuery } from "^redux/state/complex-selectors/blogs";
import { selectRecordedEventsByLanguageAndQuery } from "^redux/state/complex-selectors/recorded-events";

import { checkObjectHasField } from "^helpers/general";

// import Popover from "^components/ProximityPopover";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import FiltersUI from "^components/FiltersUI";
import TableUI from "^components/display-content-items-page/table/TableUI";
import ArticleProvidersWithArticleLanguages from "^components/articles/ArticleProviders";
import {
  AuthorsCell,
  LanguagesCell,
  StatusCell,
  TagsCell,
  TitleCell,
} from "^components/display-content-items-page/table/Cells";
import DocLanguages from "^components/DocLanguages";
import ContentMenu from "^components/menus/Content";
import BlogProviders from "^components/blogs/BlogProviders";
import RecordedEventProviders from "^components/recorded-events/RecordedEventProviders";

import UI from "./UI";

type AddContentToDoc = ({
  docId,
  docType,
}: {
  docId: string;
  docType: "article" | "blog" | "recorded-event";
}) => void;

type ComponentContextValue = {
  docType: string;
  addContentToDoc: AddContentToDoc;
};
const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

const ComponentProvider = ({
  children,
  contextValue,
}: {
  children: ReactElement;
  contextValue: ComponentContextValue;
}) => {
  return (
    <ComponentContext.Provider value={contextValue}>
      {children}
    </ComponentContext.Provider>
  );
};

const useComponentContext = () => {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

// * clicking outside to close popover not working (bug)
function PrimaryContentPopover({
  children: button,
  ...contextValue
}: {
  children: ReactElement;
} & ComponentContextValue) {
  return (
    <Popover>
      {button}
      <Popover.Panel css={[tw`z-40 fixed inset-1`]}>
        {({ close }) => (
          <ComponentProvider
            contextValue={{
              ...contextValue,
              addContentToDoc: (props: Parameters<AddContentToDoc>[0]) => {
                contextValue.addContentToDoc(props);
                close();
              },
            }}
          >
            <Panel close={close} />
          </ComponentProvider>
        )}
      </Popover.Panel>
      <Popover.Overlay css={[tw`fixed inset-0 bg-overlayLight`]} />
    </Popover>
  );
}

export default PrimaryContentPopover;

PrimaryContentPopover.Button = function Button({
  children,
}: {
  children: ReactElement;
}) {
  return <Popover.Button>{children}</Popover.Button>;
};

const Panel = ({ close }: { close: () => void }) => {
  const { docType } = useComponentContext();

  return (
    <UI.Panel>
      <div css={[tw`absolute right-0.5 top-0.5`]}>
        <ContentMenu.Button onClick={close} tooltipProps={{ text: "close" }}>
          <span css={[tw`text-xl`]}>
            <X />
          </span>
        </ContentMenu.Button>
      </div>
      <UI.DescriptionContainer>
        <UI.Title>Add Content</UI.Title>
        <UI.Description>Add content to this {docType}.</UI.Description>
      </UI.DescriptionContainer>
      <div css={[tw`mt-md`]}>
        <FilterProviders>
          <>
            <FiltersUI marginLeft={false}>
              <>
                <LanguageSelect.Select />
                <DocsQuery.InputCard />
              </>
            </FiltersUI>
            <TablePopulated />
          </>
        </FilterProviders>
      </div>
    </UI.Panel>
  );
};

const FilterProviders = ({ children }: { children: ReactElement }) => {
  return (
    <DocsQuery.Provider>
      <LanguageSelect.Provider>{children}</LanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

const TablePopulated = () => {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );
  const blogsFiltered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, { languageId, query })
  );
  const recordedEventsFiltered = useSelector((state) =>
    selectRecordedEventsByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <Table
      isContent={Boolean(articlesFiltered.length || blogsFiltered.length)}
      isFilter={isFilter}
    >
      <>
        {articlesFiltered.map((article) => (
          <ArticleProvidersWithArticleLanguages
            article={article}
            key={article.id}
          >
            <ArticleRow />
          </ArticleProvidersWithArticleLanguages>
        ))}
        {blogsFiltered.map((blog) => (
          <BlogProviders blog={blog} key={blog.id}>
            <BlogRow />
          </BlogProviders>
        ))}
        {recordedEventsFiltered.map((recordedEvent) => (
          <RecordedEventProviders
            recordedEvent={recordedEvent}
            key={recordedEvent.id}
          >
            <RecordedEventRow />
          </RecordedEventProviders>
        ))}
      </>
    </Table>
  );
};

const Table = ({
  children: rows,
  isFilter,
  isContent,
}: {
  children: ReactElement;
  isFilter: boolean;
  isContent: boolean;
}) => {
  return (
    <TableUI.Container css={[tw`grid-cols-expand7 mt-md`]}>
      <TableUI.TitleCell>Title</TableUI.TitleCell>
      <TableUI.TitleCell>Type</TableUI.TitleCell>
      <TableUI.TitleCell>Actions</TableUI.TitleCell>
      <TableUI.TitleCell>Status</TableUI.TitleCell>
      <TableUI.TitleCell>Authors</TableUI.TitleCell>
      <TableUI.TitleCell>Tags</TableUI.TitleCell>
      <TableUI.TitleCell>Translations</TableUI.TitleCell>
      {isContent ? (
        rows
      ) : (
        <TableUI.NoEntriesPlaceholder css={[tw`col-span-7`]}>
          {isFilter ? "- No entries yet -" : "- No entries for filter -"}
        </TableUI.NoEntriesPlaceholder>
      )}
      <TableUI.BottomSpacingForScrollBar css={[tw`col-span-7`]} />
    </TableUI.Container>
  );
};

const ArticleRow = () => {
  const [
    { id: articleId, status, publishDate, authorsIds, tagsIds, languagesIds },
  ] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();
  const { addContentToDoc } = useComponentContext();

  return (
    <>
      <TitleCell status={status} title={title} />
      <TypeCell>Article</TypeCell>
      <ActionsCell
        addToDocument={() => {
          addContentToDoc({ docId: articleId, docType: "article" });
        }}
      />
      <StatusCell publishDate={publishDate} status={status} />
      <AuthorsCell
        activeLanguageId={activeLanguageId}
        authorsIds={authorsIds}
      />
      <TagsCell tagsIds={tagsIds} />
      <LanguagesCell
        activeLanguageId={activeLanguageId}
        languagesIds={languagesIds}
        setActiveLanguageId={setActiveLanguageId}
      />
    </>
  );
};

const TypeCell = ({ children }: { children: string }) => {
  return <TableUI.Cell>{children}</TableUI.Cell>;
};

const ActionsCell = ({ addToDocument }: { addToDocument: () => void }) => {
  return (
    <TableUI.Cell>
      <ContentMenu.Button
        onClick={addToDocument}
        tooltipProps={{ text: "add to document" }}
      >
        <FilePlus />
      </ContentMenu.Button>
    </TableUI.Cell>
  );
};

const BlogRow = () => {
  const [
    { id: blogId, status, publishDate, authorsIds, tagsIds, languagesIds },
  ] = BlogSlice.useContext();
  const [{ title }] = BlogTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();
  const { addContentToDoc } = useComponentContext();

  return (
    <>
      <TitleCell status={status} title={title} />
      <TypeCell>Blog</TypeCell>
      <ActionsCell
        addToDocument={() => {
          addContentToDoc({ docId: blogId, docType: "blog" });
        }}
      />
      <StatusCell publishDate={publishDate} status={status} />
      <AuthorsCell
        activeLanguageId={activeLanguageId}
        authorsIds={authorsIds}
      />
      <TagsCell tagsIds={tagsIds} />
      <LanguagesCell
        activeLanguageId={activeLanguageId}
        languagesIds={languagesIds}
        setActiveLanguageId={setActiveLanguageId}
      />
    </>
  );
};

const RecordedEventRow = () => {
  const [
    {
      id: recordedEventId,
      status,
      publishDate,
      authorsIds,
      tagsIds,
      languagesIds,
    },
  ] = RecordedEventSlice.useContext();
  const [{ title }] = RecordedEventTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();
  const { addContentToDoc } = useComponentContext();

  return (
    <>
      <TitleCell status={status} title={title} />
      <TypeCell>Recorded Event</TypeCell>
      <ActionsCell
        addToDocument={() => {
          addContentToDoc({
            docId: recordedEventId,
            docType: "recorded-event",
          });
        }}
      />
      <StatusCell publishDate={publishDate} status={status} />
      <AuthorsCell
        activeLanguageId={activeLanguageId}
        authorsIds={authorsIds}
      />
      <TagsCell tagsIds={tagsIds} />
      <LanguagesCell
        activeLanguageId={activeLanguageId}
        languagesIds={languagesIds}
        setActiveLanguageId={setActiveLanguageId}
      />
    </>
  );
};
