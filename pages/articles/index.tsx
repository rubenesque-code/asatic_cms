import type { NextPage } from "next";
import { FilePlus, FileText, Info, Trash } from "phosphor-react";

import { useSelector, useDispatch } from "^redux/hooks";
import { useFetchArticlesQuery } from "^redux/services/articles";
import { useFetchTagsQuery } from "^redux/services/tags";
import {
  selectById as selectArticleById,
  selectIds as selectArticlesIds,
  removeOne as removeArticle,
} from "^redux/state/articles";
import { selectEntitiesByIds as selectTagEntitiesByIds } from "^redux/state/tags";
import { selectEntitiesByIds as selectLanguageEntitiesByIds } from "^redux/state/languages";

import QueryDataInit from "^components/QueryDataInit";
import Head from "^components/Head";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Article } from "^types/article";
import { computeErrors } from "^helpers/article";
import WithTooltip from "^components/WithTooltip";
import { formatDateTimeAgo } from "^helpers/index";
import { useFetchLanguagesQuery } from "^redux/services/languages";
import { ROUTES } from "^constants/routes";
import WithWarning from "^components/WithWarning";

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
    <main className="px-4 mt-xxl grid gap-lg">
      <div className="ml-xl grid gap-lg">
        <h2 className="text-2xl font-medium">Articles</h2>
        <div>
          <CreateArticleButton />
        </div>
      </div>
      <Table />
    </main>
  );
};

const CreateArticleButton = () => {
  return (
    <button className="flex items-center gap-8 border bg-blue-500 duration-75 active:translate-y-0.5 active:translate-x-0.5 transition-all tim ease-in-out text-white rounded-md py-2 px-4">
      <span className="font-medium uppercase text-sm">Create article</span>
      <span className="">
        <FilePlus />
      </span>
    </button>
  );
};

const Table = () => {
  const articleIds = useSelector(selectArticlesIds);
  const numArticles = articleIds.length;

  return (
    <div className="min-w-full w-auto grid grid-cols-expand5 overflow-x-auto children:border children:whitespace-nowrap children:px-3">
      <div
        data-tip="hello world"
        className="py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200"
      >
        Title
      </div>
      <div className="py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200">
        Actions
      </div>
      <div className="py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200">
        Status
      </div>
      <div className="py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200">
        Tags
      </div>
      <div className="py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200">
        Translations
      </div>
      {numArticles ? (
        articleIds.map((id) => <TableRow id={id} key={id} />)
      ) : (
        <p className="text-center col-span-5 uppercase text-xs py-3">
          - No articles yet -
        </p>
      )}
      <div className="col-span-5 h-10 bg-white border-white" />
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

const Cell = ({
  children,
  textCenter,
}: {
  children: ReactElement;
  textCenter?: boolean;
}) => {
  return (
    <div className={`py-2 text-gray-600 ${textCenter && "text-center"}`}>
      {children}
    </div>
  );
};

const TitleCell = ({ title }: { title: string | undefined }) => {
  const isTitle = title?.length;

  return (
    <Cell textCenter={!isTitle}>
      <p>{isTitle ? title : "-"}</p>
    </Cell>
  );
};

const ActionsCell = ({ id }: { id: string }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Cell>
      <div className="flex gap-4 justify-center items-center">
        {/* <WithPopover
          button={
            <MenuButton
              icon={<EyeIcon className="w-4 h-4" />}
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
        <WithTooltip text="Go to edit document page">
          <button
            className="grid place-items-center"
            onClick={() => router.push(`${ROUTES.ARTICLES}/${id}`)}
            type="button"
          >
            <FileText />
          </button>
        </WithTooltip>
        <WithWarning
          callbackToConfirm={() => dispatch(removeArticle({ id }))}
          warningText={{
            heading: "Delete artile?",
          }}
        >
          {({ showWarning }) => (
            <WithTooltip text="Delete document">
              <button
                className="grid place-items-center"
                onClick={showWarning}
                type="button"
              >
                <Trash />
              </button>
            </WithTooltip>
          )}
        </WithWarning>
      </div>
    </Cell>
  );
};

const StatusCell = ({ article }: { article: Article }) => {
  const errors = computeErrors(article);
  const isError = errors?.length;

  if (isError) {
    return (
      <Cell>
        <div className="flex justify-center items-center gap-2">
          {errors?.map((errorStr, i) => (
            <span
              className="rounded-lg py-[0.5px] px-2 bg-red-200 text-red-500"
              key={i}
            >
              {errorStr}
            </span>
          ))}
          <WithTooltip text="Documents with errors won't be shown on your website">
            <Info />
          </WithTooltip>
        </div>
      </Cell>
    );
  }

  const isNew = !article.lastSave;

  if (isNew) {
    return (
      <StatusCellNonError>
        <p className="bg-blue-200 text-blue-500">new</p>
      </StatusCellNonError>
    );
  }

  const publishInfo = article.publishInfo;
  const publishStatus = publishInfo.status;

  const isDraft = publishStatus === "draft";

  if (isDraft) {
    return (
      <StatusCellNonError>
        <p className="bg-gray-200 text-gray-500">draft</p>
      </StatusCellNonError>
    );
  }

  const publishDateFormatted = formatDateTimeAgo(publishInfo.date);

  return (
    <StatusCellNonError>
      <p className="bg-green-200 text-green-500">
        Published ${publishDateFormatted}
      </p>
    </StatusCellNonError>
  );
};

const StatusCellNonError = ({ children }: { children: ReactElement }) => (
  <Cell>
    <div className="text-center py-0.5 px-2">{children}</div>
  </Cell>
);

const TagsCell = ({ tagIds }: { tagIds: Article["tags"] }) => {
  const tags = useSelector((state) => selectTagEntitiesByIds(state, tagIds));
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tagsTextArr = tags.map((t) => t!.text);
  const tagsStr = tagsTextArr ? tagsTextArr.join(", ") : null;
  const areTags = tagsStr;

  return (
    <Cell textCenter={!areTags}>
      <p>{areTags ? tagsStr : "-"}</p>
    </Cell>
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

  return (
    <Cell>
      <p>{languagesStr}</p>
    </Cell>
  );
};
