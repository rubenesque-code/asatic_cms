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
import { useDispatch, useSelector } from "^redux/hooks";
import {
  removeOne as deleteSubject,
  selectAll as selectSubjects,
} from "^redux/state/subjects";
import {
  applyFilters,
  fuzzySearchWrapper,
  filterDocsByLanguageId,
  mapLanguageIds,
  filterPrimaryContentByRelationToSubContentDoc,
} from "^helpers/general";
import { Subject as SubjectType } from "^types/subject";
import { fuzzySearchSubjects } from "^helpers/subjects";
import ListWrapperUI from "^components/sub-content-page/ListWrapperUI";
import ListItem from "^components/content-list/ListItem";
import { SubjectProvider, useSubjectContext } from "^context/SubjectContext";
import TranslationUI from "^components/content-list/TranslationUI";
import TranslationLanguageUI from "^components/content-list/TranslationLanguageUI";
import { selectById as selectLanguageById } from "^redux/state/languages";
import { SubjectTranslationProvider } from "^context/SubjectTranslationProvider";
import { useSubjectTranslationContext } from "^context/SubjectTranslationProvider";
import TranslationTitleEditor from "^components/sub-content-page/TranslationTitleEditor";
import NoContentUI from "^components/sub-content-page/NoContentUI";
import NoContentForFilterUI from "^components/sub-content-page/NoContentForFilterUI";
import TranslationsWrapperUI from "^components/sub-content-page/TranslationsWrapperUI";
import DeleteTranslationButtonUI from "^components/sub-content-page/DeleteTranslationButtonUI";
import ContentMenuUI from "^components/sub-content-page/ContentMenuUI";
import WithAddTranslation from "^components/WithAddTranslation";
import { ContentMenuVerticalBar } from "^components/menus/Content";
import AddTranslationButtonUI from "^components/sub-content-page/AddTranslationButtonUI";
import RelatedContentPopovers from "^components/sub-content-page/RelatedContentPopovers";
import DeleteContentButtonUI from "^components/sub-content-page/DeleteContentButtonUI";
import {
  removeSubject as removeSubjectFromArticle,
  selectAll as selectArticles,
} from "^redux/state/articles";
import {
  removeSubject as removeSubjectFromBlog,
  selectAll as selectBlogs,
} from "^redux/state/blogs";
import {
  removeSubject as removeSubjectFromRecordedEvent,
  selectAll as selectRecordedEvents,
} from "^redux/state/recordedEvents";

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
        <>
          <FiltersUI languageSelect={<LanguageSelect />} search={<Search />} />
          <div css={[tw`mt-lg`]}>
            <List />
          </div>
        </>
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
    <ListUI subjects={filteredSubjects} />
  ) : areAnySubjects ? (
    <NoContentForFilterUI>subjects</NoContentForFilterUI>
  ) : (
    <NoContentUI>subjects</NoContentUI>
  );
};

const ListUI = ({ subjects }: { subjects: SubjectType[] }) => (
  <ListWrapperUI>
    {subjects.map((subject, i) => (
      <ListItem
        content={
          <SubjectProvider subject={subject}>
            <ListItemContentUI />
          </SubjectProvider>
        }
        index={i}
        key={subject.id}
      />
    ))}
  </ListWrapperUI>
);

// translations
// menu
const ListItemContentUI = () => (
  <div css={[tw`flex items-center gap-md`]} className="group">
    <SubjectTranslations />
    <ContentMenu />
  </div>
);

const SubjectTranslations = () => {
  const [{ id, translations }] = useSubjectContext();

  return (
    <TranslationsWrapperUI>
      {translations.map((translation, i) => (
        <SubjectTranslationProvider
          translation={translation}
          subjectId={id}
          key={translation.id}
        >
          <Translation index={i} />
        </SubjectTranslationProvider>
      ))}
    </TranslationsWrapperUI>
  );
};

const Translation = ({ index }: { index: number }) => {
  return (
    <TranslationUI
      deleteTranslationButton={(translationIsHovered) => (
        <DeleteTranslationButton translationIsHovered={translationIsHovered} />
      )}
      isNotFirstInList={index > 0}
      translationLanguage={<TranslationLanguage />}
      translationTitle={<TranslationTitle />}
    />
  );
};

const DeleteTranslationButton = ({
  translationIsHovered,
}: {
  translationIsHovered: boolean;
}) => {
  const [{ translations }] = useSubjectContext();
  const [, { removeTranslation }] = useSubjectTranslationContext();

  const canDelete = translations.length > 1;

  if (!canDelete) {
    return null;
  }

  const handleDeleteTranslation = () => {
    if (!canDelete) {
      return;
    }

    removeTranslation();
  };

  return (
    <DeleteTranslationButtonUI
      deleteFunc={handleDeleteTranslation}
      show={translationIsHovered}
    />
  );
};

const TranslationLanguage = () => {
  const [{ languageId }] = useSubjectTranslationContext();

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return <TranslationLanguageUI language={language} />;
};

const TranslationTitle = () => {
  const [{ text, id }, { updateText }] = useSubjectTranslationContext();

  return (
    <TranslationTitleEditor
      injectedValue={text}
      onChange={(text) => updateText({ text })}
      id={id}
    />
  );
};

const ContentMenu = () => {
  const [{ id }] = useSubjectContext();

  return (
    <ContentMenuUI>
      <AddTranslationButton />
      <ContentMenuVerticalBar />
      <RelatedContentPopovers subContentId={id} subContentType="subject" />
      <ContentMenuVerticalBar />
      <DeleteContentButton />
    </ContentMenuUI>
  );
};

const AddTranslationButton = () => {
  const [{ translations }, { addTranslation }] = useSubjectContext();
  const languageIds = mapLanguageIds(translations);

  return (
    <WithAddTranslation
      docLanguageIds={languageIds}
      docType="subjects"
      onSubmit={(languageId) => addTranslation({ languageId })}
    >
      <AddTranslationButtonUI />
    </WithAddTranslation>
  );
};

// todo: change below to a deleteSubContentHook
const DeleteContentButton = () => {
  const [{ id: subjectId }] = useSubjectContext();

  const dispatch = useDispatch();

  const articles = useSelector(selectArticles);
  const blogs = useSelector(selectBlogs);
  const recordedEvents = useSelector(selectRecordedEvents);

  const articlesRelatedToSubject =
    filterPrimaryContentByRelationToSubContentDoc({
      content: articles,
      subContentField: "subjectIds",
      subContentId: subjectId,
    });

  const blogsRelatedToSubject = filterPrimaryContentByRelationToSubContentDoc({
    content: blogs,
    subContentField: "subjectIds",
    subContentId: subjectId,
  });

  const recordedEventsRelatedToSubject =
    filterPrimaryContentByRelationToSubContentDoc({
      content: recordedEvents,
      subContentField: "subjectIds",
      subContentId: subjectId,
    });

  const handleDeleteSubject = () => {
    for (let i = 0; i < articlesRelatedToSubject.length; i++) {
      const { id: articleId } = articlesRelatedToSubject[i];
      dispatch(removeSubjectFromArticle({ id: articleId, subjectId }));
    }
    for (let i = 0; i < blogsRelatedToSubject.length; i++) {
      const { id: blogId } = blogsRelatedToSubject[i];
      dispatch(removeSubjectFromBlog({ id: blogId, subjectId }));
    }
    for (let i = 0; i < recordedEventsRelatedToSubject.length; i++) {
      const { id: recordedEventId } = recordedEventsRelatedToSubject[i];
      dispatch(
        removeSubjectFromRecordedEvent({ id: recordedEventId, subjectId })
      );
    }
    dispatch(deleteSubject({ id: subjectId }));
  };

  return (
    <DeleteContentButtonUI deleteFunc={handleDeleteSubject} docType="subject" />
  );
};
