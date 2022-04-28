import type { NextPage } from "next";
import tw from "twin.macro";

import { useDispatch, useSelector } from "^redux/hooks";
import { useFetchArticlesQuery } from "^redux/services/articles";
import { selectById, updateDate } from "^redux/state/articles";
import { selectAll as selectAllTags } from "^redux/state/tags";
import { selectAll as selectAllLanguagues } from "^redux/state/languages";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import { useFetchTagsQuery } from "^redux/services/tags";
import { useFetchLanguagesQuery } from "^redux/services/languages";
import { DocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";
import Header from "^components/header";
import ArticleBodyTextEditor from "^components/text-editor/ArticleBody";
import RichTextEditor from "^components/text-editor/Rich";
// import TitleTextEditor from "^components/text-editor/Title";
import { Article as ArticleType } from "^types/article";
import DatePicker from "^components/date-picker";
import AuthorPopover from "^components/AuthorPopover";
import { DEFAULTLANGUAGEID } from "^constants/data";

//* fetches within fetch queries won't be invoked if have been already

// todo: author panel: can delete if unused; can delete with warning if used; can edit and update (need to be able to update!)
// todo: redirect if article doesn't exist
// todo: translation for dates
// todo: go over button css abstractions; could have an 'action' type button;

const ArticlePage: NextPage = () => {
  const queryData = [
    useFetchArticlesQuery(),
    useFetchTagsQuery(),
    useFetchLanguagesQuery(),
  ];

  return (
    <>
      <Head />
      <QueryDataInit queryData={queryData}>
        <PageContent />
      </QueryDataInit>
    </>
  );
};

export default ArticlePage;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <PageHeader />
      <div css={[s_canvas]}>
        <Article />
      </div>
    </div>
  );
};

const s_canvas = tw`bg-gray-50 pt-md pb-lg px-md border-2 border-gray-200 flex-grow flex flex-col`;

const PageHeader = () => {
  return (
    <DocTopLevelControlsContext
      isChange={true}
      save={{
        func: () => null,
        saveMutationData: {
          isError: false,
          isLoading: false,
          isSuccess: false,
        },
      }}
      undo={{ func: () => null }}
    >
      <Header />
    </DocTopLevelControlsContext>
  );
};

const useArticleData = () => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) =>
    selectById(state, articleId)
  ) as ArticleType;

  return article;
};

const Article = () => {
  return (
    <div css={[s_article.container]}>
      <article
        css={[
          tw`prose p-sm prose-sm sm:prose md:prose-lg lg:prose-xl font-serif-eng focus:outline-none`,
        ]}
      >
        <header css={[tw`flex flex-col gap-sm`]}>
          <Date />
          <Title />
          <Author />
        </header>
      </article>
    </div>
  );
};

const s_article = {
  container: tw`bg-white py-xl pb-lg px-sm shadow-md flex-grow flex justify-center`,
};

const Date = () => {
  const dispatch = useDispatch();

  const article = useArticleData();
  const date = article.publishInfo.date;

  return (
    <DatePicker
      date={date}
      onChange={(date) => dispatch(updateDate({ articleId: article.id, date }))}
    />
  );
};

const Title = () => {
  const fallbackContent = "<h1></h1>";
  const initialContent = fallbackContent;
  const onUpdate = (output: string) => null;

  const customDocContent = "heading";
  const placeholder = () => "Enter title here";

  return (
    <RichTextEditor
      docContent={customDocContent}
      initialContent={initialContent}
      onUpdate={onUpdate}
      placeholder={placeholder}
    />
  );
};

const Author = () => {
  const article = useArticleData();
  const author = article.translations.find(
    (t) => t.languageId === article.defaultTranslationId
  );

  return <AuthorPopover authorId={author?.id} languageId={DEFAULTLANGUAGEID} />;
};
