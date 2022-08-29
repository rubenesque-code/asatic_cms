import type { NextPage } from "next";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";
import {
  FileText as FileTextIcon,
  Info as InfoIcon,
  Trash as TrashIcon,
} from "phosphor-react";

import {
  useCreateArticleMutation,
  useDeleteArticleMutation,
} from "^redux/services/articles";

import { useSelector } from "^redux/hooks";
import { selectEntitiesByIds as selectTagEntitiesByIds } from "^redux/state/tags";
import { selectById as selectLanguageById } from "^redux/state/languages";
import { selectAuthorById as selectAuthorById } from "^redux/state/authors";
import { selectSubjectById as selectSubjectById } from "^redux/state/subjects";
import { selectCollectionById as selectCollectionById } from "^redux/state/collections";
import { selectArticles } from "^redux/state/articles";

import { QueryProvider, useQueryContext } from "^context/QueryContext";
import {
  LanguageSelectProvider,
  useLanguageSelectContext,
} from "^context/LanguageSelectContext";
import ArticleSlice from "^context/articles/ArticleContext";
import {
  SelectLanguageProvider,
  useSelectLanguageContext,
} from "^context/SelectLanguageContext";
import {
  useWriteMutationContext,
  WriteMutationProvider,
} from "^context/WriteMutationContext";
import {
  DeleteMutationProvider,
  useDeleteMutationContext,
} from "^context/DeleteMutationContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import useFuzzySearchPrimaryContent from "^hooks/useFuzzySearchPrimaryContent";
import useArticleStatus from "^hooks/useArticleStatus";
import useMutationText from "^hooks/useMutationText";

import { filterDocsByLanguageId, formatDateTimeAgo } from "^helpers/general";

import { ROUTES } from "^constants/routes";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import { Author as AuthorType } from "^types/author";
import { Subject as SubjectType } from "^types/subject";
import { Collection as CollectionType } from "^types/collection";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import HeaderGenericUI from "^components/header/HeaderGeneric2";
import MissingText from "^components/MissingText";
import LanguageSelectInitial from "^components/LanguageSelect";
import MutationTextUI from "^components/display-content-items-page/MutationTextUI";
import PageWrapperUI from "^components/display-content-items-page/PageWrapperUI";
import CreateButtonUI from "^components/display-content-items-page/CreateButtonUI";
import MainUI from "^components/display-content-items-page/MainUI";
import FiltersUI from "^components/FiltersUI";
import SearchUI from "^components/SearchUI";
import TableUI from "^components/display-content-items-page/table/TableUI";
import CellContainerUI from "^components/display-content-items-page/table/CellContainerUI";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import MapSubContentUI from "^components/display-content-items-page/table/MapSubContentUI";
import StatusUI from "^components/display-content-items-page/table/StatusUI";
import ContentMenu from "^components/menus/Content";
import ArticlesPageContent from "^components/articles/articles-page";

const ArticlesPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.ARTICLES,
          CollectionKey.AUTHORS,
          CollectionKey.COLLECTIONS,
          CollectionKey.LANGUAGES,
          CollectionKey.SUBJECTS,
          CollectionKey.TAGS,
        ]}
      >
        <ArticlesPageContent />
      </QueryDatabase>
    </>
  );
};

export default ArticlesPage;

const PageContentOld = () => (
  <PageWrapperUI>
    <MutationProviders>
      <Header />
      <Main />
    </MutationProviders>
  </PageWrapperUI>
);

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const writeMutation = useCreateArticleMutation();
  const deleteMutation = useDeleteArticleMutation();

  return (
    <WriteMutationProvider mutation={writeMutation}>
      <DeleteMutationProvider mutation={deleteMutation}>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};

const Header = () => (
  <HeaderGenericUI
    leftElements={<MutationText />}
    confirmBeforeLeavePage={false}
  />
);

const MutationText = () => {
  const [, createMutationData] = useWriteMutationContext();
  const [, deleteMutationData] = useDeleteMutationContext();

  const { isError, isLoading, isSuccess, mutationType } = useMutationText({
    createMutationData,
    deleteMutationData,
  });

  return (
    <MutationTextUI
      mutationData={{ isError, isLoading, isSuccess }}
      mutationType={mutationType}
    />
  );
};

const Main = () => (
  <MainUI
    createButton={<CreateButton />}
    children={<FiltersAndTable />}
    title="Articles"
  />
);

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <CreateButtonUI docType="article" onClick={writeToDb} />;
};

const FilterProviders = ({ children }: { children: ReactElement }) => (
  <QueryProvider>
    <LanguageSelectProvider>{children}</LanguageSelectProvider>
  </QueryProvider>
);

const FiltersAndTable = () => (
  <FilterProviders>
    <>
      <FiltersUI languageSelect={<LanguageSelect />} search={<Search />} />
      <Table />
    </>
  </FilterProviders>
);

const Search = () => {
  const { query, setQuery } = useQueryContext();

  return (
    <SearchUI
      onQueryChange={setQuery}
      placeholder="search by title, subject, etc."
      query={query}
    />
  );
};

const LanguageSelect = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguageSelectContext();

  return (
    <LanguageSelectInitial
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};

const Table = () => {
  const { query } = useQueryContext();
  const { selectedLanguage } = useLanguageSelectContext();

  const articles = useSelector(selectArticles);

  const articlesFilteredByLanguage = filterDocsByLanguageId(
    articles,
    selectedLanguage.id
  );

  const filteredArticles = useFuzzySearchPrimaryContent(
    articlesFilteredByLanguage,
    query
  );

  const isContentPostFilter = Boolean(filteredArticles.length);
  const isContentPreFilter = Boolean(articles.length);

  return (
    <TableUI
      isContentPostFilter={isContentPostFilter}
      isContentPrefilter={isContentPreFilter}
    >
      <>
        {filteredArticles.map((article) => (
          <ArticleSlice.Provider article={article} key={article.id}>
            <TableRow />
          </ArticleSlice.Provider>
        ))}
      </>
    </TableUI>
  );
};

const TableRow = () => {
  const [{ id, languagesIds: languagesById, translations }] =
    ArticleSlice.useContext();

  return (
    <SelectLanguageProvider languagesById={languagesById}>
      {({ activeLanguageId }) => (
        <ArticleTranslationSlice.Provider
          articleId={id}
          translation={
            translations.find((t) => t.languageId === activeLanguageId)!
          }
        >
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
        </ArticleTranslationSlice.Provider>
      )}
    </SelectLanguageProvider>
  );
};

const TitleCell = () => {
  const [article] = ArticleSlice.useContext();
  const status = useArticleStatus(article);

  const [{ title }] = ArticleTranslationSlice.useContext();

  return (
    <CellContainerUI>
      {title ? (
        title
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </CellContainerUI>
  );
};

const ActionsCell = () => {
  const [{ id }] = ArticleSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  const router = useRouter();
  const routeToArticle = () => router.push(`${ROUTES.ARTICLES}/${id}`);

  return (
    <CellContainerUI>
      <div css={[tw`flex gap-xs justify-center items-center`]}>
        <ContentMenu.Button
          onClick={routeToArticle}
          tooltipProps={{ text: "edit article" }}
        >
          <FileTextIcon />
        </ContentMenu.Button>
        <WithWarning
          callbackToConfirm={() => deleteFromDb({ id })}
          warningText={{
            heading: "Delete article?",
            body: "This action can't be undone.",
          }}
          width={tw`w-['20ch'] min-w-['20ch']`}
        >
          <ContentMenu.Button
            tooltipProps={{ text: "delete article", yOffset: 10 }}
          >
            <TrashIcon />
          </ContentMenu.Button>
        </WithWarning>
      </div>
    </CellContainerUI>
  );
};

const StatusCell = () => {
  const [article] = ArticleSlice.useContext();

  const status = useArticleStatus(article);

  const { publishDate } = article;
  const publishDateFormatted = publishDate
    ? formatDateTimeAgo(publishDate)
    : null;

  return (
    <CellContainerUI>
      {status === "new" ? (
        <StatusUI colorStyles={tw`bg-blue-200 text-blue-500`}>new</StatusUI>
      ) : status === "draft" ? (
        <StatusUI colorStyles={tw`bg-gray-200 text-gray-500`}>draft</StatusUI>
      ) : status === "invalid" ? (
        <StatusUI colorStyles={tw`bg-red-200 text-red-500`}>
          <div css={[tw`flex items-center gap-xxs`]}>
            invalid
            <span css={[tw`text-gray-500`]}>
              <WithTooltip
                text={{
                  header: "Invalid Document",
                  body: `This document is published but has no valid translation. It won't be shown on the website.`,
                }}
              >
                <InfoIcon />
              </WithTooltip>
            </span>
          </div>
        </StatusUI>
      ) : typeof status === "object" ? (
        <StatusUI colorStyles={tw`bg-orange-200 text-orange-500`}>
          <div css={[tw`flex items-center gap-xxs`]}>
            errors
            <span css={[tw`text-gray-500`]}>
              <WithTooltip
                text={{
                  header: "Article errors",
                  body: `This article is published but has errors. It's still valid and will be shown on the website. Errors: ${status.join(
                    ", "
                  )}`,
                }}
              >
                <InfoIcon />
              </WithTooltip>
            </span>
          </div>
        </StatusUI>
      ) : (
        <StatusUI colorStyles={tw`bg-green-200 text-green-500`}>
          {`Published ${publishDateFormatted}`}
        </StatusUI>
      )}
    </CellContainerUI>
  );
};

const AuthorsCell = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();

  return (
    <CellContainerUI>
      <MapSubContentUI
        ids={authorsIds}
        subContentItem={({ id }) => <HandleAuthor id={id} />}
      />
    </CellContainerUI>
  );
};

const HandleAuthor = ({ id }: { id: string }) => {
  const author = useSelector((state) => selectAuthorById(state, id));

  return author ? (
    <Author author={author} />
  ) : (
    <SubContentMissingFromStore subContentType="author" />
  );
};

const Author = ({ author: { translations } }: { author: AuthorType }) => {
  const [activeLanguageId] = useSelectLanguageContext();

  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <>
      {translation ? (
        translation.name
      ) : (
        <MissingText tooltipText="missing author name for translation" />
      )}
    </>
  );
};

const SubjectsCell = () => {
  const [{ subjectsIds }] = ArticleSlice.useContext();

  return (
    <CellContainerUI>
      <MapSubContentUI
        ids={subjectsIds}
        subContentItem={({ id }) => <HandleSubject id={id} />}
      />
    </CellContainerUI>
  );
};

const HandleSubject = ({ id }: { id: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, id));

  return subject ? (
    <Subject subject={subject} />
  ) : (
    <SubContentMissingFromStore subContentType="subject" />
  );
};

const Subject = ({ subject: { translations } }: { subject: SubjectType }) => {
  const [activeLanguageId] = useSelectLanguageContext();

  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <>
      {translation ? (
        translation.text
      ) : (
        <MissingText tooltipText="missing subject text for translation" />
      )}
    </>
  );
};

const CollectionsCell = () => {
  const [{ collectionsIds }] = ArticleSlice.useContext();

  return (
    <CellContainerUI>
      <MapSubContentUI
        ids={collectionsIds}
        subContentItem={({ id }) => <HandleCollection id={id} />}
      />
    </CellContainerUI>
  );
};

const HandleCollection = ({ id }: { id: string }) => {
  const collection = useSelector((state) => selectCollectionById(state, id));

  return collection ? (
    <Collection collection={collection} />
  ) : (
    <SubContentMissingFromStore subContentType="collection" />
  );
};

const Collection = ({ collection }: { collection: CollectionType }) => {
  const [activeLanguageId] = useSelectLanguageContext();
  const { translations } = collection;
  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <>
      {translation ? (
        translation.title
      ) : (
        <MissingText tooltipText="missing collection text for translation" />
      )}
    </>
  );
};

const TagsCell = () => {
  const [{ tagsIds }] = ArticleSlice.useContext();
  const tags = useSelector((state) => selectTagEntitiesByIds(state, tagsIds));
  const validTags = tags.flatMap((t) => (t ? [t] : []));
  const tagsToUse = validTags.slice(0, 2);
  const tagsTextArr = tagsToUse.map((t) => t.text);

  const numTags = validTags.length;
  const tagsStr = numTags
    ? `${tagsTextArr.join(", ")}${numTags > 2 && ", ..."}`
    : "-";

  return <CellContainerUI>{tagsStr}</CellContainerUI>;
};

const LanguagesCell = () => {
  const [activeLanguageId, { setActiveLanguageId }] =
    useSelectLanguageContext();
  const [{ languagesIds: languagesById }] = ArticleSlice.useContext();

  return (
    <CellContainerUI>
      <MapSubContentUI
        ids={languagesById}
        subContentItem={({ id }) => (
          <Language
            languageId={id}
            isSelected={id === activeLanguageId}
            onClick={() => setActiveLanguageId(id)}
          />
        )}
      />
    </CellContainerUI>
  );
};

const Language = ({
  isSelected,
  languageId,
  onClick,
}: {
  languageId: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return language ? (
    <WithTooltip
      text="click to show this translation"
      type="action"
      isDisabled={isSelected}
    >
      <button
        css={[isSelected && tw`border-b-2 border-green-active`]}
        onClick={onClick}
        type="button"
      >
        {language.name}
      </button>
    </WithTooltip>
  ) : (
    <SubContentMissingFromStore subContentType="language" />
  );
};
