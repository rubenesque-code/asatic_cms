import type { NextPage } from "next";
import { useRouter } from "next/router";
import tw from "twin.macro";
import { CloudArrowUp, FilePlus, FileText, Info, Trash } from "phosphor-react";

import { useSelector, useDispatch } from "^redux/hooks";

import {
  selectById as selectArticleById,
  selectIds as selectArticlesIds,
  removeOne as removeArticle,
  addOne as addArticle,
} from "^redux/state/articles";
import { selectEntitiesByIds as selectTagEntitiesByIds } from "^redux/state/tags";
import { selectEntitiesByIds as selectLanguageEntitiesByIds } from "^redux/state/languages";

import { formatDateTimeAgo } from "^helpers/general";
import { computeErrors } from "^helpers/article";

import { DocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

import useArticlesPageTopControls from "^hooks/pages/useArticlesPageTopControls";

import { ROUTES } from "^constants/routes";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { Article } from "^types/article";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import SideBar from "^components/header/SideBar";
import DocControls from "^components/header/DocControls";

import { s_header } from "^styles/header";

// todo: table min width. Use min ch for each cell.
// todo: toasts on save, undo, delete article

const ProgrammesPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.TAGS,
          Collection.LANGUAGES,
        ]}
      >
        {/* <QueryDataInit docTypes={["articles", "authors", "tags", "languages"]}> */}
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default ProgrammesPage;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <Header />
      <main css={[s_top.main]}>
        <div css={[s_top.indentedContainer]}>
          <h1 css={[s_top.pageTitle]}>Articles</h1>
          <div>
            <CreateArticleButton />
          </div>
        </div>
        <Table />
      </main>
    </div>
  );
};

const s_top = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  indentedContainer: tw`ml-xl grid gap-lg`,
  pageTitle: tw`text-2xl font-medium`,
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useArticlesPageTopControls();

  return (
    <DocTopLevelControlsContext
      isChange={isChange}
      save={{
        func: handleSave,
        saveMutationData,
      }}
      undo={{ func: handleUndo }}
    >
      <header css={[s_header.container, tw`border-b`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <DocControls />
          <div css={[s_header.verticalBar]} />
          <button css={[s_header.button]}>
            <CloudArrowUp />
          </button>
        </div>
      </header>
    </DocTopLevelControlsContext>
  );
};

const CreateArticleButton = () => {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => dispatch(addArticle())}
      tw="flex items-center gap-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 duration-75 active:translate-y-0.5 active:translate-x-0.5 transition-all ease-in-out text-white rounded-md py-2 px-4"
      type="button"
    >
      <span tw="font-medium uppercase text-sm">Create article</span>
      <span>
        <FilePlus />
      </span>
    </button>
  );
};

const Table = () => {
  const articleIds = useSelector(selectArticlesIds);
  const numArticles = articleIds.length;

  return (
    <div css={[s_table.container]}>
      <div css={s_table.columnTitle}>Title</div>
      <div css={s_table.columnTitle}>Actions</div>
      <div css={s_table.columnTitle}>Status</div>
      <div css={s_table.columnTitle}>Tags</div>
      <div css={s_table.columnTitle}>Translations</div>
      {numArticles ? (
        articleIds.map((id) => <TableRow id={id} key={id} />)
      ) : (
        <p css={[s_table.noEntriesPlaceholder]}>- No articles yet -</p>
      )}
      <div css={[s_table.bottomSpacingForScrollBar]} />
    </div>
  );
};

const s_table = {
  container: tw`min-w-full w-auto grid grid-cols-expand5 overflow-x-auto overflow-visible`,
  columnTitle: tw`py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200`,
  noEntriesPlaceholder: tw`text-center col-span-5 uppercase text-xs py-3`,
  bottomSpacingForScrollBar: tw`col-span-5 h-10 bg-white border-white`,
};

const TableRow = ({ id }: { id: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const article = useSelector((state) => selectArticleById(state, id))!;

  const translations = article.translations;
  // const translationToUseId = article.translations[0].id
  // const translation = translations.find((t) => t.id === translationToUseId)!;
  const translation = translations[0];

  return (
    <>
      <TitleCell title={translation.title} />
      <ActionsCell id={id} />
      <StatusCell article={article} />
      <TagsCell tagIds={article.tagIds} />
      <LanguagesCell translations={article.translations} />
    </>
  );
};

const TitleCell = ({ title }: { title: string | undefined }) => {
  const isTitle = title?.length;

  return (
    <div css={[s_cell.bodyDefault, !isTitle && tw`text-center`]}>
      {isTitle ? title : "-"}
    </div>
  );
};

const s_cell = {
  bodyDefault: tw`py-2 text-gray-600 border whitespace-nowrap px-3 `,
  statusNonError: {
    shell: tw`py-1 grid place-items-center border`,
    body: tw`text-center rounded-lg py-[0.5px] px-2`,
  },
};

const ActionsCell = ({ id }: { id: string }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div css={[s_cell.bodyDefault, tw`flex gap-4 justify-center items-center`]}>
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
      <WithTooltip yOffset={10} text="edit article">
        <button
          tw="grid place-items-center"
          onClick={() => router.push(`${ROUTES.ARTICLES}/${id}`)}
          type="button"
        >
          <FileText />
        </button>
      </WithTooltip>
      <WithWarning callbackToConfirm={() => dispatch(removeArticle({ id }))}>
        <WithTooltip yOffset={10} text="delete article">
          <button tw="grid place-items-center" type="button">
            <Trash />
          </button>
        </WithTooltip>
      </WithWarning>
    </div>
  );
};

const StatusCell = ({ article }: { article: Article }) => {
  const errors = computeErrors(article);
  const isError = errors?.length;

  if (isError) {
    return (
      <div
        css={[s_cell.bodyDefault, tw`flex justify-center items-center gap-2`]}
      >
        {errors?.map((errorStr, i) => (
          <span tw="rounded-lg py-[0.5px] px-2 bg-red-200 text-red-500" key={i}>
            {errorStr}
          </span>
        ))}
        <WithTooltip text="Documents with errors won't be shown on your website">
          <Info />
        </WithTooltip>
      </div>
    );
  }

  const isNew = !article.lastSave;

  if (isNew) {
    return (
      <div css={[s_cell.statusNonError.shell]}>
        <p css={[s_cell.statusNonError.body, tw`bg-blue-200 text-blue-500`]}>
          new
        </p>
      </div>
    );
  }

  const publishInfo = article.publishInfo;
  const publishStatus = publishInfo.status;

  const isDraft = publishStatus === "draft";

  if (isDraft) {
    return (
      <div css={[s_cell.statusNonError.shell]}>
        <p css={[s_cell.statusNonError.body, tw`bg-gray-200 text-gray-500`]}>
          draft
        </p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const publishDateFormatted = formatDateTimeAgo(publishInfo.date!);

  return (
    <div css={[s_cell.statusNonError.shell]}>
      <p css={[s_cell.statusNonError.body, tw`bg-green-200 text-green-500`]}>
        Published ${publishDateFormatted}
      </p>
    </div>
  );
};

const TagsCell = ({ tagIds }: { tagIds: string[] }) => {
  const tags = useSelector((state) => selectTagEntitiesByIds(state, tagIds));
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tagsTextArr = tags.map((t) => t!.text);
  const areTags = tags.length;
  const tagsStr = areTags ? tagsTextArr.join(", ") : null;

  return (
    <div css={[s_cell.bodyDefault, !areTags && tw`text-center`]}>
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
  const languagesTextArr = languages.map((l) => l!.name);
  const languagesStr = languagesTextArr.join(", ");

  return <div css={[s_cell.bodyDefault]}>{languagesStr}</div>;
};
