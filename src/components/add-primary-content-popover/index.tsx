import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";

import { checkObjectHasField } from "^helpers/general";

import UI from "./UI";

import Popover from "^components/ProximityPopover";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import FiltersUI from "^components/FiltersUI";
import TableUI from "^components/display-content-items-page/table/TableUI";
import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";
import ArticleProviders from "^components/articles/ArticleProviders";
import {
  AuthorsCell,
  LanguagesCell,
  StatusCell,
  TagsCell,
  TitleCell,
} from "^components/display-content-items-page/table/Cells";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import DocLanguages from "^components/DocLanguages";

type ComponentContextValue = { docType: string };
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

// todo: articles table doesn't quite work: e.g. hase delete mutation stuff
const useComponentContext = () => {
  const context = useContext(ComponentContext);
  // console.log('context:', context)
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

function PrimaryContentPopover({
  children: button,
  contextValue,
}: {
  children: ReactElement;
  contextValue: ComponentContextValue;
}) {
  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <Popover.Panel isOpen={isOpen}>
            <ComponentProvider contextValue={contextValue}>
              <Panel />
            </ComponentProvider>
          </Popover.Panel>
          {button}
        </>
      )}
    </Popover>
  );
}

export default PrimaryContentPopover;

PrimaryContentPopover.Button = Popover.Button;

const Panel = () => {
  const { docType } = useComponentContext();

  return (
    <UI.Panel>
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

  return (
    <Table isFilter={isFilter}>
      {/* <ArticlesRows /> */}
      {articlesFiltered.map((article) => (
        <ArticleProviders article={article} key={article.id}>
          <ArticleRow />
        </ArticleProviders>
      ))}
    </Table>
  );
};

const Table = ({
  children: rows,
  isFilter,
}: {
  children: ReactElement[];
  isFilter: boolean;
}) => {
  return (
    <TableUI.Container css={[tw`grid-cols-expand5`]}>
      <TableUI.TitleCell>Title</TableUI.TitleCell>
      <TableUI.TitleCell>Status</TableUI.TitleCell>
      <TableUI.TitleCell>Authors</TableUI.TitleCell>
      <TableUI.TitleCell>Tags</TableUI.TitleCell>
      <TableUI.TitleCell>Translations</TableUI.TitleCell>
      {rows.length ? (
        rows
      ) : (
        <TableUI.NoEntriesPlaceholder css={[tw`col-span-5`]}>
          {isFilter ? "- No entries yet -" : "- No entries for filter -"}
        </TableUI.NoEntriesPlaceholder>
      )}
      <TableUI.BottomSpacingForScrollBar css={[tw`col-span-5`]} />
    </TableUI.Container>
  );
};

const ArticlesRows = () => {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );
  return (
    <>
      <h3 css={[tw`col-span-5`]}>Articles</h3>
      {articlesFiltered.map((article) => (
        <ArticleProviders article={article} key={article.id}>
          <ArticleRow />
        </ArticleProviders>
      ))}
    </>
  );
};

const ArticleRow = () => {
  const [{ status, publishDate, authorsIds, tagsIds, languagesIds }] =
    ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  return (
    <>
      <TitleCell status={status} title={title} />
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
