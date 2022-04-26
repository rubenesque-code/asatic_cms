import type { NextPage } from "next";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import {
  useFetchArticleQuery,
  useFetchArticlesQuery,
} from "^redux/services/articles";
import { selectById } from "^redux/state/articles";
import { selectAll as selectAllTags } from "^redux/state/tags";
import { selectAll as selectAllLanguagues } from "^redux/state/languages";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import { useFetchTagsQuery } from "^redux/services/tags";
import { useFetchLanguagesQuery } from "^redux/services/languages";
import { DocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";
import Header from "^components/header";
import { ReactElement } from "react";
import TextEditor from "^components/text-editor";

//* fetches within fetch queries won't be invoked if have been already

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
  const articleId = useGetSubRouteId();
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
      isChangeInDoc={true}
      save={{
        func: () => null,
        isError: false,
        isLoading: false,
        isSuccess: false,
      }}
      undo={{ func: () => null }}
    >
      <Header />
    </DocTopLevelControlsContext>
  );
};

const Article = () => {
  return (
    <div css={[s_article.container]}>
      <TextEditor />
    </div>
  );
};

const s_article = {
  container: tw`bg-white py-xl pb-lg px-sm shadow-md flex-grow`,
};
