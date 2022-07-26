import type { NextPage } from "next";
import { useRouter } from "next/router";
import tw from "twin.macro";
import { toast } from "react-toastify";
import {
  FilePlus as FilePlusIcon,
  FileText as FileTextIcon,
  Info as InfoIcon,
  Trash as TrashIcon,
  WarningCircle as WarningCircleIcon,
} from "phosphor-react";

import { useSelector, useDispatch } from "^redux/hooks";

import {
  addOne as addArticle,
  selectAll as selectArticles,
} from "^redux/state/articles";
import { selectEntitiesByIds as selectTagEntitiesByIds } from "^redux/state/tags";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { formatDateTimeAgo } from "^helpers/general";
import { computeErrors } from "^helpers/article";

import useArticlesPageTopControls from "^hooks/pages/useArticlesPageTopControls";

import { ROUTES } from "^constants/routes";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import HeaderGeneric from "^components/header/HeaderGeneric";
import SaveTextUI from "^components/header/SaveTextUI";
import UndoButtonUI from "^components/header/UndoButtonUI";
import SaveButtonUI from "^components/header/SaveButtonUI";

import { s_header } from "^styles/header";
import {
  SelectArticleTranslationProvider,
  useSelectArticleTranslationContext as useSelectTranslationContext,
} from "^context/SelectArticleTranslationContext";
import { ArticleProvider, useArticleContext } from "^context/ArticleContext";
import MissingText from "^components/MissingText";
import LanguageError from "^components/LanguageError";
import { selectById as selectAuthorById } from "^redux/state/authors";
import { Author as AuthorType } from "^types/author";
import { selectById as selectSubjectById } from "^redux/state/subjects";
import { Subject as SubjectType } from "^types/subject";
import useArticleStatus from "^hooks/useArticleStatus";

// todo: status: 'invalid/incomplete' different from 'has errors'
// todo: indicate translation of title
// todo: change translation of title by clicking on translation?
// todo: list by?; and/or search
// todo: shouldn't need to save after creating new article

// todo: table min width. Use min ch for each cell.
// todo: toasts on save, undo, delete article
// todo: article search.
// todo: on articles page, can click on translation language to change title translation. Indicate title language
// todo: article created -> go to page. Should need to save? No warning??

const ArticlesPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.LANGUAGES,
          Collection.SUBJECTS,
          Collection.TAGS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default ArticlesPage;

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
    <HeaderGeneric confirmBeforeLeavePage={isChange}>
      <div css={[tw`flex justify-between items-center`]}>
        <div css={[tw`flex items-center gap-lg`]}>
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
        <div css={[tw`flex items-center gap-sm`]}>
          <UndoButtonUI
            handleUndo={handleUndo}
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
          />
          <SaveButtonUI
            handleSave={handleSave}
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
          />
          <div css={[s_header.verticalBar]} />
        </div>
      </div>
    </HeaderGeneric>
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
        <FilePlusIcon />
      </span>
    </button>
  );
};

const Table = () => {
  const articles = useSelector(selectArticles);
  const numArticles = articles.length;

  return (
    <div css={[s_table.container]}>
      <div css={s_table.columnTitle}>Title</div>
      <div css={s_table.columnTitle}>Actions</div>
      <div css={s_table.columnTitle}>Status</div>
      <div css={s_table.columnTitle}>Authors</div>
      <div css={s_table.columnTitle}>Subjects</div>
      <div css={s_table.columnTitle}>Tags</div>
      <div css={s_table.columnTitle}>Translations</div>
      {numArticles ? (
        articles.map((article) => (
          <ArticleProvider article={article} key={article.id}>
            <TableRow />
          </ArticleProvider>
        ))
      ) : (
        <p css={[s_table.noEntriesPlaceholder]}>- No articles yet -</p>
      )}
      <div css={[s_table.bottomSpacingForScrollBar]} />
    </div>
  );
};

const s_table = {
  container: tw`min-w-full w-auto grid grid-cols-expand7 overflow-x-auto overflow-visible`,
  columnTitle: tw`py-3 text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200`,
  noEntriesPlaceholder: tw`text-center col-span-5 uppercase text-xs py-3`,
  bottomSpacingForScrollBar: tw`col-span-5 h-10 bg-white border-white`,
};

const TableRow = () => {
  const [{ translations }] = useArticleContext();

  return (
    <SelectArticleTranslationProvider translations={translations}>
      <>
        <TitleCell />
        <ActionsCell />
        <StatusCell />
        <AuthorsCell />
        <SubjectsCell />
        <TagsCell />
        <LanguagesCell />
      </>
    </SelectArticleTranslationProvider>
  );
};

const AuthorsCell = () => {
  const [{ authorIds }] = useArticleContext();

  return (
    <div css={[s_cell.bodyDefault, tw`flex items-center`]}>
      {authorIds.length ? (
        authorIds.map((id, i) => (
          <>
            <HandleAuthor id={id} key={id} />
            {i < authorIds.length - 1 ? (
              <span css={[tw`mr-xs`]}>, </span>
            ) : null}
          </>
        ))
      ) : (
        <span css={[tw`w-full text-center`]}>-</span>
      )}
    </div>
  );
};

// const AuthorsCellUI = () => <div css={[s_cell.bodyDefault]}></div>;

const HandleAuthor = ({ id }: { id: string }) => {
  const author = useSelector((state) => selectAuthorById(state, id));

  return author ? <Author author={author} /> : <MissingAuthor />;
};

const Author = ({ author }: { author: AuthorType }) => {
  const [{ languageId: selectedLanguageId }] = useSelectTranslationContext();
  const { translations } = author;
  const translation = translations.find(
    (t) => t.languageId === selectedLanguageId
  );

  return translation ? (
    <span>{translation.name}</span>
  ) : (
    <div css={[tw`flex gap-xs items-center justify-center`]}>
      <p css={[tw`text-gray-500 text-sm`]}>...</p>
      <MissingText tooltipText="missing author name for translation" />
    </div>
  );
};

const MissingAuthor = () => (
  <WithTooltip
    text={{
      header: "Missing author",
      body: "This article references an author that can't be found. It's probably been deleted, but try refreshing the page.",
    }}
  >
    <div css={[tw`flex gap-xs items-center text-red-warning`]}>
      <span>
        <WarningCircleIcon />
      </span>
    </div>
  </WithTooltip>
);

const SubjectsCell = () => {
  const [{ subjectIds }] = useArticleContext();

  return (
    <div css={[s_cell.bodyDefault, tw`flex items-center`]}>
      {subjectIds.length ? (
        subjectIds.map((id, i) => (
          <>
            <HandleSubject id={id} key={id} />
            {i < subjectIds.length - 1 ? (
              <span css={[tw`mr-xs`]}>, </span>
            ) : null}
          </>
        ))
      ) : (
        <span css={[tw`w-full text-center`]}>-</span>
      )}
    </div>
  );
};

const HandleSubject = ({ id }: { id: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, id));

  return subject ? <Subject subject={subject} /> : <MissingSubject />;
};

const Subject = ({ subject }: { subject: SubjectType }) => {
  const [{ languageId: selectedLanguageId }] = useSelectTranslationContext();
  const { translations } = subject;
  const translation = translations.find(
    (t) => t.languageId === selectedLanguageId
  );

  return translation ? (
    <span>{translation.text}</span>
  ) : (
    <div css={[tw`flex gap-xs items-center justify-center`]}>
      <p css={[tw`text-gray-500 text-sm`]}>...</p>
      <MissingText tooltipText="missing subject text for translation" />
    </div>
  );
};

const MissingSubject = () => (
  <WithTooltip
    text={{
      header: "Missing subject",
      body: "This article references an subject that can't be found. It's probably been deleted, but try refreshing the page.",
    }}
  >
    <div css={[tw`flex gap-xs items-center text-red-warning`]}>
      <span>
        <WarningCircleIcon />
      </span>
    </div>
  </WithTooltip>
);

const TitleCell = () => {
  const [article] = useArticleContext();
  const [{ title }] = useSelectTranslationContext();
  const status = useArticleStatus(article);

  return (
    <div css={[s_cell.bodyDefault, !title && tw`text-center`]}>
      {title ? (
        title
      ) : status === "new" ? (
        <span css={[tw`w-full text-center`]}>-</span>
      ) : (
        <div css={[tw`flex gap-xs items-center justify-center`]}>
          <p css={[tw`text-gray-500 text-sm`]}>...</p>
          <MissingText tooltipText="missing title for translation" />
        </div>
      )}
    </div>
  );
};

const s_cell = {
  bodyDefault: tw`py-2 text-gray-600 border whitespace-nowrap px-3`,
  statusNonError: {
    shell: tw`py-1 grid place-items-center border`,
    body: tw`text-center rounded-lg py-[0.5px] px-2`,
  },
};

const ActionsCell = () => {
  const [{ id }, { deleteArticleFromStoreAndDb }] = useArticleContext();

  const router = useRouter();

  const routeToArticle = () => router.push(`${ROUTES.ARTICLES}/${id}`);

  return (
    <div css={[s_cell.bodyDefault, tw`flex gap-4 justify-center items-center`]}>
      <WithTooltip yOffset={10} text="edit article">
        <button
          tw="grid place-items-center"
          onClick={routeToArticle}
          type="button"
        >
          <FileTextIcon />
        </button>
      </WithTooltip>
      <WithWarning
        callbackToConfirm={deleteArticleFromStoreAndDb}
        warningText={{
          heading: "Delete article?",
          body: "This action can't be undone.",
        }}
      >
        <WithTooltip yOffset={10} text="delete article">
          <button tw="grid place-items-center" type="button">
            <TrashIcon />
          </button>
        </WithTooltip>
      </WithWarning>
    </div>
  );
};

const StatusCell = () => {
  const [article] = useArticleContext();

  const status = useArticleStatus(article);

  if (status === "new") {
    return (
      <div css={[s_cell.statusNonError.shell]}>
        <p css={[s_cell.statusNonError.body, tw`bg-blue-200 text-blue-500`]}>
          new
        </p>
      </div>
    );
  }

  if (status === "draft") {
    return (
      <div css={[s_cell.statusNonError.shell]}>
        <p css={[s_cell.statusNonError.body, tw`bg-gray-200 text-gray-500`]}>
          draft
        </p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div css={[s_cell.statusNonError.shell, tw`relative`]}>
        <div
          css={[
            s_cell.statusNonError.body,
            tw`flex items-center gap-xxs`,
            tw`bg-red-200 text-red-500`,
          ]}
        >
          <p>Invalid</p>
          <span css={[tw`text-gray-500`]}>
            <WithTooltip
              text={{
                header: "Invalid article",
                body: "This article was set to published but has no valid translation. It won't be shown on the website.",
              }}
            >
              <InfoIcon />
            </WithTooltip>
          </span>
        </div>
      </div>
    );
  }

  const isError = typeof status === "object";
  if (isError) {
    const errors = status;
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
          <InfoIcon />
        </WithTooltip>
      </div>
    );
  }

  const publishInfo = article.publishInfo;
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

const TagsCell = () => {
  const [{ tagIds }] = useArticleContext();
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

const LanguagesCell = () => {
  const [{ translations }] = useArticleContext();
  const [{ id: selectedTranslationId }, { updateActiveTranslation }] =
    useSelectTranslationContext();

  return (
    <div css={[s_cell.bodyDefault]}>
      {translations.map((t, i) => (
        <>
          <Language
            isSelected={t.id === selectedTranslationId}
            languageId={t.languageId}
            onClick={() => updateActiveTranslation(t.id)}
            key={t.id}
          />
          {i < translations.length - 1 ? ", " : null}
        </>
      ))}
    </div>
  );
};

const Language = ({
  isSelected,
  languageId,
  onClick,
}: {
  languageId: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return language ? (
    <WithTooltip
      text="click to show this translation for this article"
      type="action"
      isDisabled={isSelected}
    >
      <button
        css={[isSelected && tw`border-b-2 border-green-active`]}
        onClick={onClick}
        type="button"
      >
        {language.name}
      </button>
    </WithTooltip>
  ) : (
    <LanguageError>Error</LanguageError>
  );
};
