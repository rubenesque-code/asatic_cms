import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectArticleById as selectArticleById } from "^redux/state/articles";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import DocLanguages from "^components/DocLanguages";

import ContainersUI from "./ContainersUI";
import HeaderUnpopulated from "./Header";
import ArticleUI from "./ArticleUI";
import ArticleBodyEmpty from "./ArticleBodyEmpty";
import ArticleBody from "./ArticleBody";
import ArticleHeader from "./ArticleHeader";

// todo: dragging body sections not good as may be too long

const ArticlePageContent = () => {
  return (
    <ContainersUI.ScreenHeight>
      <Providers>
        <>
          <Header />
          <ContainersUI.Canvas>{<Article />}</ContainersUI.Canvas>
        </>
      </Providers>
    </ContainersUI.ScreenHeight>
  );
};

export default ArticlePageContent;

const Providers = ({ children }: { children: ReactElement }) => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectArticleById(state, articleId))!;

  return (
    <ArticleSlice.Provider article={article}>
      {([{ languagesIds: articleLanguagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={articleLanguagesIds}>
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

const Article = () => {
  const [{ body }] = ArticleTranslationSlice.useContext();

  return (
    <ArticleUI>
      <>
        <ArticleHeader />
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
