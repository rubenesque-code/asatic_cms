import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectById as selectArticleById } from "^redux/state/articles";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import ContainersUI from "./ContainersUI";
import HeaderUnpopulated from "./Header";
import DocLanguages from "^components/DocLanguages";
import ArticleUI from "./ArticleUI";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import DatePicker from "^components/date-picker";
import InlineTextEditor from "^components/editors/Inline";
import ArticleBodyEmpty from "./ArticleBodyEmpty";
import ArticleBody from "./ArticleBody";

const ArticlePageContent = () => {
  return (
    <ContainersUI.FillScreenHeight>
      <Providers>
        <>
          <Header />
          <Main />
        </>
      </Providers>
    </ContainersUI.FillScreenHeight>
  );
};

export default ArticlePageContent;

const Providers = ({ children }: { children: ReactElement }) => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectArticleById(state, articleId))!;

  return (
    <ArticleSlice.Provider article={article}>
      {([
        { languagesIds, translations },
        { addTranslation, removeTranslation },
      ]) => (
        <DocLanguages.SelectProvider
          docLanguagesIds={languagesIds}
          docType="article"
          onAddLanguageToDoc={(languageId) => addTranslation({ languageId })}
          onRemoveLanguageFromDoc={(languageId) =>
            removeTranslation({ languageId })
          }
        >
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
        </DocLanguages.SelectProvider>
      )}
    </ArticleSlice.Provider>
  );
};

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData: { isError, isLoading, isSuccess },
  } = useArticlePageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <HeaderUnpopulated
      isChange={isChange}
      save={save}
      saveMutationData={{
        isError,
        isLoading,
        isSuccess,
      }}
      undo={undo}
    />
  );
};

const Main = () => {
  return (
    <ContainersUI.ContentCanvas>
      <Article />
    </ContainersUI.ContentCanvas>
  );
};

const Article = () => {
  const [{ body }] = ArticleTranslationSlice.useContext();

  return (
    <ArticleUI>
      <>
        <ArticleUI.Header>
          <Date />
          <Title />
          <Authors />
        </ArticleUI.Header>
        {body.length ? (
          <ArticleBody.Provider>
            <ArticleBody.Body />
          </ArticleBody.Provider>
        ) : (
          <ArticleBodyEmpty />
        )}
      </>
    </ArticleUI>
  );
};

const Date = () => {
  const [{ publishDate }, { updatePublishDate }] = ArticleSlice.useContext();

  return (
    <DatePicker
      date={publishDate}
      onChange={(date) => updatePublishDate({ date })}
    />
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    ArticleTranslationSlice.useContext();

  return (
    <ArticleUI.Title>
      <InlineTextEditor
        injectedValue={title || ""}
        onUpdate={(title) => updateTitle({ title })}
        placeholder="Title"
        key={translationId}
      />
    </ArticleUI.Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  return (
    <ArticleUI.Authors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </ArticleUI.Authors>
  );
};
