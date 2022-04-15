import type { NextPage } from "next";
import { useRouter } from "next/router";
import tw from "twin.macro";
import { FilePlus, FileText, Info, Trash } from "phosphor-react";

import { useSelector, useDispatch } from "^redux/hooks";
import { useFetchArticlesQuery } from "^redux/services/articles";
import { useFetchTagsQuery } from "^redux/services/tags";
import { useFetchLanguagesQuery } from "^redux/services/languages";
import {
  selectById as selectArticleById,
  selectIds as selectArticlesIds,
  removeOne as removeArticle,
  addOne as addArticle,
} from "^redux/state/articles";
import { selectEntitiesByIds as selectTagEntitiesByIds } from "^redux/state/tags";
import { selectEntitiesByIds as selectLanguageEntitiesByIds } from "^redux/state/languages";

import { formatDateTimeAgo } from "^helpers/index";
import { computeErrors } from "^helpers/article";

import { ROUTES } from "^constants/routes";

import { Article } from "^types/article";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import { ReactElement } from "react";

// todo: button in withwarning and on add article below - use same?
// todo: create defaults in tailwind config for e.g. headings?

const ProgrammesPage: NextPage = () => {
  const queryData = [
    useFetchArticlesQuery(),
    useFetchTagsQuery(),
    useFetchLanguagesQuery(),
  ];

  return (
    <div>
      <Head />
      <QueryDataInit queryData={queryData}>
        <PageContent />
      </QueryDataInit>
    </div>
  );
};

export default ProgrammesPage;

const PageContent = () => {
  return (
    <main tw="px-4 mt-xxl grid gap-lg">
      <div tw="ml-xl grid gap-lg">
        <h2 tw="text-2xl font-medium">Articles</h2>
        <div>
          <CreateArticleButton />
        </div>
      </div>
      <Table />
    </main>
  );
};

const CreateArticleButton = () => {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => dispatch(addArticle())}
      tw="flex items-center gap-8 border bg-blue-500 duration-75 active:translate-y-0.5 active:translate-x-0.5 transition-all ease-in-out text-white rounded-md py-2 px-4"
      type="button"
    >
      <span tw="font-medium uppercase text-sm">Create article</span>
      <span>
        <FilePlus />
      </span>
    </button>
  );
};

const cellStyles = {
  title: tw`py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200`,
  bodyDefault: (props: { textCenter?: boolean } | void) => [
    tw`py-2 text-gray-600`,
    props?.textCenter && tw`text-center`,
  ],
  statusNonError: {
    shell: tw`py-1 grid place-items-center`,
    body: tw`text-center rounded-lg py-[0.5px] px-2`,
  },
};

const Table = () => {
  const articleIds = useSelector(selectArticlesIds);
  const numArticles = articleIds.length;

  return (
    <div tw="min-w-full w-auto grid grid-cols-expand5 overflow-x-auto all-child:border all-child:whitespace-nowrap all-child:px-3">
      <div css={cellStyles.title}>Title</div>
      <div css={cellStyles.title}>Actions</div>
      <div css={cellStyles.title}>Status</div>
      <div css={cellStyles.title}>Tags</div>
      <div css={cellStyles.title}>Translations</div>
      {numArticles ? (
        articleIds.map((id) => <TableRow id={id} key={id} />)
      ) : (
        <p tw="text-center col-span-5 uppercase text-xs py-3">
          - No articles yet -
        </p>
      )}
      <div tw="col-span-5 h-10 bg-white border-white" />
    </div>
  );
};

const TableRow = ({ id }: { id: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const article = useSelector((state) => selectArticleById(state, id))!;

  const translations = article.translations;
  const translationToUseId = article.defaultTranslationId;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = translations.find((t) => t.id === translationToUseId)!;

  return (
    <>
      <TitleCell title={translation.title} />
      <ActionsCell id={id} />
      <StatusCell article={article} />
      <TagsCell tagIds={article.tags} />
      <LanguagesCell translations={article.translations} />
    </>
  );
};

const TitleCell = ({ title }: { title: string | undefined }) => {
  const isTitle = title?.length;

  return (
    <div css={cellStyles.bodyDefault({ textCenter: Boolean(!isTitle) })}>
      {isTitle ? title : "-"}
    </div>
  );
};

const ActionsCell = ({ id }: { id: string }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div
      css={[
        ...cellStyles.bodyDefault(),
        tw`flex gap-4 justify-center items-center`,
      ]}
    >
      {/* <WithPopover
          button={
            <MenuButton
              icon={<EyeIcon tw="w-4 h-4" />}
              tooltip={{ text: "Preview document" }}
            />
          }
          renderPanel={(closePreview) => (
            <PreviewPanel close={closePreview}>
              <ArticlePreviewContent docId={doc.id} />
            </PreviewPanel>
          )}
          useOverlay={true}
        /> */}
      {/* <WithTooltip text="Go to edit document page"> */}
      <button
        tw="grid place-items-center"
        onClick={() => router.push(`${ROUTES.ARTICLES}/${id}`)}
        type="button"
      >
        <FileText />
      </button>
      {/* </WithTooltip> */}
      {/* <WithWarning
        callbackToConfirm={() => dispatch(removeArticle({ id }))}
        warningText={{
          heading: "Delete article?",
        }}
      >
        {({ showWarning }) => (
          <WithTooltip text="Delete document"> */}
      <button
        tw="grid place-items-center"
        // onClick={showWarning}
        type="button"
      >
        <Trash />
      </button>
      {/* </WithTooltip>
        )}
      </WithWarning> */}
    </div>
  );
};

const StatusNonErrorCellShell = tw.div`py-1 grid place-items-center`;

// const StatusNonErrorCellShell = ({ children }: { children: ReactElement }) => (
//   <div css={[cellStyles.statusNonError.shell]}>{children}</div>
// );

const StatusCell = ({ article }: { article: Article }) => {
  const errors = computeErrors(article);
  const isError = errors?.length;

  if (isError) {
    return (
      <div
        css={[
          ...cellStyles.bodyDefault(),
          tw`flex justify-center items-center gap-2`,
        ]}
      >
        {errors?.map((errorStr, i) => (
          <span tw="rounded-lg py-[0.5px] px-2 bg-red-200 text-red-500" key={i}>
            {errorStr}
          </span>
        ))}
        {/* <WithTooltip text="Documents with errors won't be shown on your website"> */}
        <Info />
        {/* </WithTooltip> */}
      </div>
    );
  }

  const isNew = !article.lastSave;

  if (isNew) {
    return (
      <StatusNonErrorCellShell>
        <p
          css={[cellStyles.statusNonError.body, tw`bg-blue-200 text-blue-500`]}
        >
          new
        </p>
      </StatusNonErrorCellShell>
    );
  }

  const publishInfo = article.publishInfo;
  const publishStatus = publishInfo.status;

  const isDraft = publishStatus === "draft";

  if (isDraft) {
    return (
      <StatusNonErrorCellShell>
        <p css={[cellStyles.statusNonError, tw`bg-gray-200 text-gray-500`]}>
          draft
        </p>
      </StatusNonErrorCellShell>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const publishDateFormatted = formatDateTimeAgo(publishInfo.date!);

  return (
    <StatusNonErrorCellShell>
      <p css={[cellStyles.statusNonError, tw`bg-green-200 text-green-500`]}>
        Published ${publishDateFormatted}
      </p>
    </StatusNonErrorCellShell>
  );
};

const TagsCell = ({ tagIds }: { tagIds: Article["tags"] }) => {
  const tags = useSelector((state) => selectTagEntitiesByIds(state, tagIds));
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tagsTextArr = tags.map((t) => t!.text);
  const areTags = tags.length;
  const tagsStr = areTags ? tagsTextArr.join(", ") : null;

  return (
    <div css={[...cellStyles.bodyDefault({ textCenter: Boolean(!areTags) })]}>
      {areTags ? tagsStr : "-"}
    </div>
  );
};

const LanguagesCell = ({
  translations,
}: {
  translations: Article["translations"];
}) => {
  const languagesIds = translations.map((t) => t.languageId);
  const languages = useSelector((state) =>
    selectLanguageEntitiesByIds(state, languagesIds)
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const languagesTextArr = languages.map((l) => l!.text);
  const languagesStr = languagesTextArr.join(", ");

  return <div css={[...cellStyles.bodyDefault()]}>{languagesStr}</div>;
};
