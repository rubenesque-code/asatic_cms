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
} from "^helpers/general";
import { Subject as SubjectType } from "^types/subject";
import { fuzzySearchSubjects } from "^helpers/subjects";
import ListWrapperUI from "^components/sub-content-page/ListWrapperUI";
import ListItem from "^components/content-list/ListItem";
import {
  SubjectProvider,
  useSubjectContext,
} from "^context/subjects/SubjectContext";
import TranslationUI from "^components/content-list/TranslationUI";
import TranslationLanguageUI from "^components/content-list/TranslationLanguageUI";
import { selectById as selectLanguageById } from "^redux/state/languages";
import {
  SubjectTranslationProvider,
  useSubjectTranslationContext,
} from "^context/subjects/SubjectTranslationProvider";
import TranslationTitleEditor from "^components/sub-content-page/TranslationTitleEditor";
import NoContentUI from "^components/sub-content-page/NoContentUI";
import NoContentForFilterUI from "^components/sub-content-page/NoContentForFilterUI";
import TranslationsWrapperUI from "^components/sub-content-page/TranslationsWrapperUI";
import DeleteTranslationButtonUI from "^components/sub-content-page/DeleteTranslationButtonUI";
import ContentMenuUI from "^components/sub-content-page/ContentMenuUI";
import WithAddTranslation from "^components/WithAddTranslation";
import AddTranslationButtonUI from "^components/sub-content-page/AddTranslationButtonUI";
import RelatedContentPopovers from "^components/sub-content-page/RelatedContentPopovers";
import DeleteContentButtonUI from "^components/sub-content-page/DeleteContentButtonUI";

import useDeleteSubContentFromPrimaryContent from "^hooks/useDeleteSubContentFromPrimaryContent";
import ContentMenu from "^components/menus/Content";

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

const ListItemContentUI = () => (
  <div css={[tw`flex items-center gap-md`]} className="group">
    <SubjectTranslations />
    <Menu />
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
          <TranslationUI
            deleteTranslationButton={
              translations.length
                ? (translationIsHovered) => (
                    <DeleteTranslationButton
                      translationIsHovered={translationIsHovered}
                    />
                  )
                : null
            }
            isNotFirstInList={i > 0}
            translationLanguage={<TranslationLanguage />}
            translationTitle={<TranslationTitle />}
          />
        </SubjectTranslationProvider>
      ))}
    </TranslationsWrapperUI>
  );
};

const DeleteTranslationButton = ({
  translationIsHovered,
}: {
  translationIsHovered: boolean;
}) => {
  const [, { removeTranslation }] = useSubjectTranslationContext();

  return (
    <DeleteTranslationButtonUI
      deleteFunc={removeTranslation}
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

const Menu = () => {
  const [{ id }] = useSubjectContext();

  return (
    <ContentMenuUI>
      <AddTranslationButton />
      <ContentMenu.VerticalBar />
      <RelatedContentPopovers subContentId={id} subContentType="subject" />
      <ContentMenu.VerticalBar />
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

const DeleteContentButton = () => {
  const [{ id: subjectId }] = useSubjectContext();

  const dispatch = useDispatch();

  const deleteSubectFromPrimaryContent = useDeleteSubContentFromPrimaryContent({
    subContentId: subjectId,
    subContentType: "subject",
  });

  const handleDeleteSubject = () => {
    deleteSubectFromPrimaryContent();
    dispatch(deleteSubject({ id: subjectId }));
  };

  return (
    <DeleteContentButtonUI deleteFunc={handleDeleteSubject} docType="subject" />
  );
};
