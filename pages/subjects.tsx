import { NextPage } from "next";
import tw from "twin.macro";

import { Collection as CollectionKeys } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import { MainUI } from "^components/sub-content-page/MainUI";
import {
  ContentFilterProvider,
  useContentFilterContext,
} from "^context/ContentFilterContext";

import FiltersUI from "^components/sub-content-page/FiltersUI";
import LanguageSelectInitial from "^components/LanguageSelect";
import SearchUI from "^components/sub-content-page/SearchUI";
import { useSelector } from "^redux/hooks";
import { selectAll as selectSubjects } from "^redux/state/subjects";
import {
  applyFilters,
  fuzzySearchWrapper,
  filterDocsByLanguageId,
} from "^helpers/general";
import { Subject as SubjectType } from "^types/subject";
import { fuzzySearchSubjects } from "^helpers/subjects";
import NoContentTextUI from "^components/sub-content-page/NoContentTextUI";
import ListWrapperUI from "^components/sub-content-page/ListWrapperUI";
import ListItem from "^components/content-list/ListItem";
import { SubjectProvider } from "^context/SubjectContext";

const CollectionsPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKeys.ARTICLES,
          CollectionKeys.BLOGS,
          CollectionKeys.LANGUAGES,
          CollectionKeys.RECORDEDEVENTS,
          CollectionKeys.SUBJECTS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default CollectionsPage;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex-col gap-lg`]}>
      <Main />
    </div>
  );
};

const Main = () => (
  <MainUI
    title="Subjects"
    explanatoryText="Subjects are broad - such as biology, art or politics. They are displayed on the website menu."
  >
    <>
      <ContentFilterProvider>
        <FiltersUI languageSelect={<LanguageSelect />} search={<Search />} />
      </ContentFilterProvider>
    </>
  </MainUI>
);

const LanguageSelect = () => {
  const { selectedLanguage, setSelectedLanguage } = useContentFilterContext();

  return (
    <LanguageSelectInitial
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};

const Search = () => {
  const { query, setQuery } = useContentFilterContext();

  return (
    <SearchUI
      labelText="Subject name:"
      onQueryChange={setQuery}
      placeholder="subject name"
      query={query}
    />
  );
};

const List = () => {
  const subjects = useSelector(selectSubjects);

  const { query, selectedLanguage } = useContentFilterContext();

  const filteredSubjects = applyFilters(subjects, [
    (subjects: SubjectType[]) =>
      filterDocsByLanguageId(subjects, selectedLanguage.id),
    (subjects: SubjectType[]) =>
      fuzzySearchWrapper(subjects, query, fuzzySearchSubjects),
  ]);

  const areAnySubjects = Boolean(subjects.length);
  const areAnySubjectsPostFilter = Boolean(filteredSubjects.length);

  return areAnySubjectsPostFilter ? (
    <ListWrapperUI>
      {filteredSubjects.map((subject, i) => (
        <ListItem
          content={
            <SubjectProvider subject={subject}>
              <SubjectUI />
            </SubjectProvider>
          }
          index={i}
          key={subject.id}
        />
      ))}
    </ListWrapperUI>
  ) : areAnySubjects ? (
    <NoContentTextUI>No subjects for filter</NoContentTextUI>
  ) : (
    <NoContentTextUI>No subjects yet</NoContentTextUI>
  );
};

// translations
// menu
const SubjectUI = () => <div></div>;

/*
Header
Main
  - Filters
    - input query
    - select language
  -- filters logic is independent of content type
  - List
*/
