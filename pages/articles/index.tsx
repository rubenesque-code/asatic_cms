import type { NextPage } from "next";
import { FilePlus } from "phosphor-react";

import { useSelector, useDispatch } from "^redux/hooks";
import { useFetchArticlesQuery } from "^redux/services/articles";
import {
  selectAll,
  selectById,
  selectIds,
  selectTotal,
} from "^redux/state/articles";

import QueryDataInit from "^components/QueryDataInit";
import Head from "^components/Head";
import { useRouter } from "next/router";

const ProgrammesPage: NextPage = () => {
  const queryData = [useFetchArticlesQuery()];

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
    <div className="px-4">
      <div className="mt-32 ml-10">
        <h2 className="text-2xl font-medium">Articles</h2>
        <CreateArticleButton />
      </div>
      <Table />
    </div>
  );
};

const CreateArticleButton = () => {
  return (
    <button className="mt-10 flex items-center gap-8 border bg-blue-500 duration-75 active:translate-y-0.5 active:translate-x-0.5 transition-all tim ease-in-out text-white rounded-md py-2 px-4">
      <span className="font-medium uppercase text-sm">Create article</span>
      <span className="">
        <FilePlus />
      </span>
    </button>
  );
};

const Table = () => {
  const articleIds = useSelector(selectIds);
  const numArticles = articleIds.length;

  return (
    <div className="mt-10 min-w-full w-auto grid grid-cols-expand5 overflow-x-auto children:border children:whitespace-nowrap children:px-3">
      <div className="py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200">
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
          - No documents yet -
        </p>
      )}
      <div className="col-span-5 h-10 bg-white border-white" />
    </div>
  );
};

const TableRow = ({ id }: { id: string }) => {
  const article = useSelector((state) => selectById(state, id));

  const router = useRouter();

  const translations = doc.translations;
  const translationToUseId = doc.defaultTranslationId;
  const translation = translations.find((t) => t.id === translationToUseId);

  const translationTitle = translation.title;
  const translationTitleInterpreted = translationTitle ? translationTitle : "-";

  const isNew = !doc.lastSave;
  const publishInfo = doc.publishInfo;
  const publishStatus = publishInfo.status;
  const isPublished = publishStatus === "published";
  const publishDateFormatted = isPublished
    ? formatDateTimeAgo(publishInfo.date)
    : null;

  const errors = computeErrors(doc);

  const nonErrorStatus = isNew
    ? "new"
    : publishStatus === "draft"
    ? "draft"
    : `Published ${publishDateFormatted}`;

  const tagsIds = doc.tags;
  const tags = useSelectTags(tagsIds);
  const tagsTextArr = tags?.map((t) => t.text);
  const tagsStr = tagsTextArr ? tagsTextArr.join(", ") : null;
  const areTags = tagsStr;
  const tagsInterpreted = areTags ? tagsStr : "-";

  const languagesIds = translations.map((t) => t.languageId);
  const languages = useSelectLanguages(languagesIds);
  const languagesTextArr = languages?.map((t) => t.text);
  const languagesStr = languagesTextArr ? languagesTextArr.join(", ") : null;

  const nonErrorStatusComponent = (
    <span
      className={` rounded-lg py-[0.5px] px-2 ${
        isNew
          ? "bg-blue-200 text-blue-500"
          : publishStatus === "draft"
          ? "bg-gray-200 text-gray-500"
          : "bg-green-200 text-green-500"
      }`}
    >
      {nonErrorStatus}
    </span>
  );
  const errorStatusComponent = (
    <div className="flex justify-center items-center gap-2">
      {errors?.map((errorStr, i) => (
        <span
          className="rounded-lg py-[0.5px] px-2 bg-red-200 text-red-500"
          key={i}
        >
          {errorStr}
        </span>
      ))}
      <WithTooltip
        bottomOffset={2}
        element={<InformationCircleIcon className="w-5" />}
        tooltipText="Documents with errors won't be shown on your website"
      />
    </div>
  );

  return (
    <>
      <div
        className={`py-2  text-gray-600 ${
          translationTitle ? "text-left" : "text-center"
        }`}
      >
        {translationTitleInterpreted}
      </div>
      <div className="py-2 text-gray-600 flex gap-4 justify-center items-center">
        <WithPopover
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
        />
        <WithTooltip
          bottomOffset={2}
          element={
            <button
              className="grid place-items-center"
              onClick={() => router.push(`${ROUTES.ARTICLES}/${doc.id}`)}
              type="button"
            >
              <PencilIcon className="w-4" />
            </button>
          }
          tooltipText="Go to edit document page"
        />

        <WithWarning
          callbackToConfirm={() => {
            const toastId = toast("Deleting...");
            deleteArticle({ docId: doc.id, toastId });
          }}
          renderComponent={(showWarningPopup) => (
            <WithTooltip
              bottomOffset={2}
              element={
                <button
                  className="grid place-items-center"
                  onClick={showWarningPopup}
                  type="button"
                >
                  <TrashIcon className="w-4" />
                </button>
              }
              tooltipText="Delete document"
            />
          )}
          warningText={{
            title: "Delete document?",
            subtitle: "This cant be undone",
          }}
        />
      </div>
      <div className="py-2 text-center text-gray-600">
        {!errors ? nonErrorStatusComponent : errorStatusComponent}
      </div>
      <div
        className={`py-2  text-gray-600 ${
          areTags ? "text-left" : "text-center"
        }`}
      >
        {tagsInterpreted}
      </div>
      <div className="py-2  text-gray-600">{languagesStr}</div>
    </>
  );
};
