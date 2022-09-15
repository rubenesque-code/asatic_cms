import {
  ChangeEvent,
  createContext,
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";
import tw from "twin.macro";
import {
  Books as BooksIcon,
  FileMinus as FileMinusIcon,
  FilePlus,
  Plus,
  Translate as TranslateIcon,
  WarningCircle,
} from "phosphor-react";
import { v4 as generateUId } from "uuid";

import { useSelector, useDispatch } from "^redux/hooks";
import {
  selectCollections,
  selectCollectionsByIds as selectCollectionsById,
  addOne as addCollection,
  selectCollectionById as selectCollectionById,
  updateTitle,
  addTranslation,
} from "^redux/state/collections";
import { selectById as selectLanguageById } from "^redux/state/languages";

import useFocused from "^hooks/useFocused";
import useMissingSubjectTranslation from "^hooks/useIsMissingSubjectTranslation";
import useMissingCollectionTranslation from "^hooks/useMissingCollectionTranslation";

import CollectionSlice from "^context/collections/CollectionContext";

import { fuzzySearchCollections } from "^helpers/collections";

import {
  Collection as CollectionType,
  CollectionTranslation as CollectionTranslationType,
} from "^types/collection";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";
import InlineTextEditor from "./editors/Inline";
import SubContentMissingFromStore from "./SubContentMissingFromStore";
import MissingText from "./MissingText";
import WithDocSubjectsUnpopulated from "./subjects";
import MissingTranslation from "./MissingTranslation";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import { checkObjectHasField } from "^helpers/general";
import ContentMenu from "./menus/Content";
import { createCollection } from "^data/createDocument";
import { nanoid } from "@reduxjs/toolkit";

// todo: display missing translation on author
// todo: display something to save

export type Props = {
  docActiveLanguageId: string;
  docCollectionsById: string[];
  docLanguagesById: string[];
  docType: string;
  onAddCollectionToDoc: (collectionId: string) => void;
  onRemoveCollectionFromDoc: (collectionId: string) => void;
};

type ComponentContextValue = Props;
const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

const ComponentProvider = ({
  children,
  ...value
}: { children: ReactElement } & ComponentContextValue) => {
  return (
    <ComponentContext.Provider value={value}>
      {children}
    </ComponentContext.Provider>
  );
};

const useComponentContext = () => {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

const WithCollections = ({
  children,
  ...topProps
}: {
  children:
    | ReactElement
    | (({
        isMissingTranslation,
      }: {
        isMissingTranslation: boolean;
      }) => ReactElement);
} & Props) => {
  const { docLanguagesById, docCollectionsById } = topProps;

  const isMissingCollectionTranslation = useMissingCollectionTranslation({
    collectionsById: docCollectionsById,
    languagesById: docLanguagesById,
  });

  const collections = useSelector((state) =>
    selectCollectionsById(state, docCollectionsById)
  ).flatMap((c) => (c ? [c] : []));
  const subjectsById = collections.flatMap((c) => c.subjectsIds);
  const subjectsByIdUnique = [...new Set(subjectsById)];
  const isMissingCollectionSubjectTranslation = useMissingSubjectTranslation({
    languagesById: docLanguagesById,
    subjectsById: subjectsByIdUnique,
  });

  const isMissingTranslation =
    isMissingCollectionTranslation || isMissingCollectionSubjectTranslation;

  return (
    <WithProximityPopover
      panel={
        <ComponentProvider {...topProps}>
          <Panel />
        </ComponentProvider>
      }
      panelMaxWidth={tw`max-w-[90vw]`}
    >
      {typeof children === "function"
        ? children({ isMissingTranslation })
        : children}
    </WithProximityPopover>
  );
};

export default WithCollections;

const Panel = () => {
  const { docCollectionsById, docType } = useComponentContext();

  const areDocCollections = Boolean(docCollectionsById.length);

  return <PanelUI areDocCollections={areDocCollections} docType={docType} />;
};

const PanelUI = ({
  areDocCollections,
  docType,
}: {
  areDocCollections: boolean;
  docType: string;
}) => (
  <div css={[s_popover.panelContainer, tw`w-[90ch] max-w-[90vw]`]}>
    <div>
      <h4 css={[tw`font-medium text-lg`]}>Collections</h4>
      <p css={[tw`text-gray-600 mt-xs text-sm`]}>
        Collections allow content to be grouped under a topic (as opposed to a
        subject, which is broader). A collection can optionally be part of a
        subject(s).
      </p>
      {!areDocCollections ? (
        <p css={[tw`text-gray-800 mt-xs text-sm`]}>
          This {docType} isn&apos;t related to any collections yet.
        </p>
      ) : (
        <p css={[tw`mt-md text-sm `]}>
          This {docType} is related to the following collection(s):
        </p>
      )}
    </div>
    <div css={[tw`flex flex-col gap-lg items-start`]}>
      {areDocCollections ? <List /> : null}
      <InputWithSelect />
    </div>
  </div>
);

const List = () => {
  const { docCollectionsById } = useComponentContext();

  return (
    <ListUI
      listItems={docCollectionsById.map((docCollectionId, i) => (
        <ListItem
          docCollectionId={docCollectionId}
          index={i}
          key={docCollectionId}
        />
      ))}
    />
  );
};

const ListUI = ({ listItems }: { listItems: ReactElement[] }) => (
  <div css={[tw`flex flex-col gap-md`]}>{listItems}</div>
);

const ListItem = ({
  docCollectionId,
  index,
}: {
  docCollectionId: string;
  index: number;
}) => {
  const number = index + 1;

  return (
    <ListItemUI
      handleCollectionValidity={
        <HandleCollectionValidity docCollectionId={docCollectionId} />
      }
      number={number}
    />
  );
};

const ListItemUI = ({
  handleCollectionValidity,
  number,
}: {
  handleCollectionValidity: ReactElement;
  number: number;
}) => (
  <div css={[tw`relative flex`]} className="group">
    <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
    {handleCollectionValidity}
  </div>
);

const HandleCollectionValidity = ({
  docCollectionId,
}: {
  docCollectionId: string;
}) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, docCollectionId)
  );

  return collection ? (
    <CollectionSlice.Provider collection={collection}>
      <ValidCollection />
    </CollectionSlice.Provider>
  ) : (
    <InvalidCollectionUI
      removeFromDocButton={
        <RemoveFromDocButton docCollectionId={docCollectionId} />
      }
    />
  );
};

const InvalidCollectionUI = ({
  removeFromDocButton,
}: {
  removeFromDocButton: ReactElement;
}) => (
  <div css={[tw`flex items-center gap-sm`]}>
    {removeFromDocButton}
    <WithTooltip
      text={{
        header: "Collection error",
        body: "A collection was added to this document that can't be found. Try refreshing the page. If the problem persists, contact the site developer.",
      }}
    >
      <span css={[tw`text-red-500 bg-white group-hover:z-50`]}>
        <WarningCircle />
      </span>
    </WithTooltip>
  </div>
);

const RemoveFromDocButton = ({
  docCollectionId,
}: {
  docCollectionId: string;
}) => {
  const { onRemoveCollectionFromDoc } = useComponentContext();

  const removeFromDoc = () => onRemoveCollectionFromDoc(docCollectionId);

  return (
    <RemoveFromDocButtonUI
      removeFromDoc={removeFromDoc}
      tooltipText="remove collection from document"
      warningText="Remove collection from document?"
    />
  );
};

const RemoveFromDocButtonUI = ({
  removeFromDoc,
  tooltipText,
  warningText,
}: {
  removeFromDoc: () => void;
  tooltipText: string;
  warningText: string;
}) => (
  <WithWarning
    callbackToConfirm={removeFromDoc}
    warningText={{ heading: warningText }}
    type="moderate"
  >
    {({ isOpen: warningIsOpen }) => (
      <ContentMenu.Button
        tooltipProps={{
          isDisabled: warningIsOpen,
          placement: "top",
          text: tooltipText,
          type: "action",
        }}
      >
        <FileMinusIcon />
      </ContentMenu.Button>
    )}
  </WithWarning>
);

const ValidCollection = () => {
  const [{ subjectsIds: collectionSubjectsById }] =
    CollectionSlice.useContext();
  const { docLanguagesById } = useComponentContext();

  const isMissingSubjectTranslationForDocLanguages =
    useMissingSubjectTranslation({
      languagesById: docLanguagesById,
      subjectsById: collectionSubjectsById,
    });

  return (
    <ValidCollectionUI
      isMissingSubjectTranslation={isMissingSubjectTranslationForDocLanguages}
    />
  );
};

const ValidCollectionUI = ({
  isMissingSubjectTranslation,
}: {
  isMissingSubjectTranslation: boolean;
}) => (
  <div css={[tw`flex gap-sm`]} className="group">
    <div
      css={[
        tw`opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in delay-300`,
        isMissingSubjectTranslation && tw`opacity-100`,
      ]}
    >
      <ValidCollectionMenu />
    </div>
    <div
      css={[
        tw`translate-x-[-73px] group-hover:z-40 group-hover:translate-x-0 transition-transform duration-150 ease-in delay-300`,
        isMissingSubjectTranslation && tw`translate-x-0`,
      ]}
    >
      <CollectionTranslations />
    </div>
  </div>
);

const ValidCollectionMenu = () => {
  const [{ id }] = CollectionSlice.useContext();

  return (
    <ValidCollectionMenuUI
      removeFromDocButton={<RemoveFromDocButton docCollectionId={id} />}
    />
  );
};

const ValidCollectionMenuUI = ({
  removeFromDocButton,
}: {
  removeFromDocButton: ReactElement;
}) => (
  <div css={[tw`flex items-center gap-xs`]}>
    {removeFromDocButton}
    <EditSubjectsButton />
    <div css={[tw`w-[0.5px] h-[15px] bg-gray-400`]} />
  </div>
);

const EditSubjectsButton = () => {
  const { docActiveLanguageId, docLanguagesById } = useComponentContext();
  const [{ subjectsIds }, { removeSubject, addSubject }] =
    CollectionSlice.useContext();

  return (
    <WithDocSubjectsUnpopulated
      docActiveLanguageId={docActiveLanguageId}
      docLanguagesById={docLanguagesById}
      docSubjectsById={subjectsIds}
      docType="collection"
      onAddSubjectToDoc={(subjectId) => addSubject({ subjectId })}
      onRemoveSubjectFromDoc={(subjectId) => removeSubject({ subjectId })}
    >
      {({ isMissingTranslation }) => (
        <EditSubjectsButtonUI isMissingTranslation={isMissingTranslation} />
      )}
    </WithDocSubjectsUnpopulated>
  );
};

const EditSubjectsButtonUI = ({
  isMissingTranslation,
}: {
  isMissingTranslation: boolean;
}) => (
  <div css={[tw`relative flex items-center`]}>
    <ContentMenu.Button
      tooltipProps={{
        text: "edit the subject(s) this  collection is a part of",
        placement: "top",
        type: "action",
      }}
    >
      <BooksIcon />
    </ContentMenu.Button>
    {isMissingTranslation ? (
      <div css={[tw`-translate-y-1 scale-90`]}>
        <MissingTranslation tooltipText="missing subject translation" />
      </div>
    ) : null}
  </div>
);

const CollectionTranslations = () => {
  const { docLanguagesById } = useComponentContext();
  const [{ translations }] = CollectionSlice.useContext();

  const translationsNotUsedInDoc = translations.filter(
    (t) => !docLanguagesById.includes(t.languageId)
  );

  return (
    <CollectionTranslationsUI
      areNonDocLanguageTranslations={Boolean(translationsNotUsedInDoc.length)}
      docLanguageTranslations={
        <>
          {docLanguagesById.map((languageId, i) => (
            <CollectionTranslation
              index={i}
              languageId={languageId}
              translation={translations.find(
                (t) => t.languageId === languageId
              )}
              type="doc"
              key={languageId}
            />
          ))}
        </>
      }
      nonDocLanguageTranslations={
        <>
          {translationsNotUsedInDoc.map((t, i) => (
            <CollectionTranslation
              index={i}
              languageId={t.languageId}
              translation={t}
              type="non-doc"
              key={t.id}
            />
          ))}
        </>
      }
    />
  );
};

const CollectionTranslationsUI = ({
  areNonDocLanguageTranslations,
  docLanguageTranslations,
  nonDocLanguageTranslations,
}: {
  areNonDocLanguageTranslations: boolean;
  docLanguageTranslations: ReactElement;
  nonDocLanguageTranslations: ReactElement;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm flex-wrap`]}>
      {docLanguageTranslations}
      {areNonDocLanguageTranslations ? (
        <>
          <div css={[tw`flex items-center gap-xxs ml-md`]}>
            <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
            <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
          </div>
          {nonDocLanguageTranslations}
        </>
      ) : null}
    </div>
  );
};

const CollectionTranslation = ({
  index,
  languageId,
  translation,
  type,
}: {
  index: number;
  languageId: string;
  translation: CollectionTranslationType | undefined;
  type: "doc" | "non-doc";
}) => {
  const [{ id: collectionId }] = CollectionSlice.useContext();

  const dispatch = useDispatch();
  const isFirst = Boolean(index === 0);

  const handleUpdateCollectionTranslation = (title: string) => {
    if (translation) {
      dispatch(
        updateTitle({ id: collectionId, translationId: translation.id, title })
      );
    } else {
      dispatch(addTranslation({ id: collectionId, languageId }));
    }
  };
  const translationText = translation?.title;

  return (
    <CollectionTranslationUI
      isDocLanguage={type === "doc"}
      isFirst={isFirst}
      language={<CollectionTranslationLanguage languageId={languageId} />}
      translationText={
        <CollectionTranslationText
          onUpdate={handleUpdateCollectionTranslation}
          text={translationText}
          translationType={type}
        />
      }
    />
  );
};

const CollectionTranslationUI = ({
  isDocLanguage,
  isFirst,
  language,
  translationText,
}: {
  isDocLanguage: boolean;
  isFirst: boolean;
  language: ReactElement;
  translationText: ReactElement;
}) => {
  return (
    <div css={[tw`flex gap-sm items-center`]}>
      {!isFirst ? <div css={[tw`h-[16px] w-[0.5px] bg-gray-200`]} /> : null}
      <div
        css={[
          tw`flex gap-xs`,
          !isDocLanguage && tw`pointer-events-none opacity-40`,
        ]}
      >
        <span>{translationText}</span>
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <TranslateIcon />
          </span>
          {language}
        </p>
      </div>
    </div>
  );
};

const CollectionTranslationText = ({
  onUpdate,
  text,
  translationType,
}: {
  onUpdate: (text: string) => void;
  text: string | undefined;
  translationType: "doc" | "non-doc";
}) => {
  return (
    <CollectionTranslationTextUI
      disableEditing={translationType === "non-doc"}
      isText={Boolean(text?.length)}
      onUpdate={onUpdate}
      text={text || ""}
    />
  );
};

const CollectionTranslationTextUI = ({
  disableEditing,
  isText,
  onUpdate,
  text,
}: {
  disableEditing: boolean;
  isText: boolean;
  onUpdate: (text: string) => void;
  text: string;
}) => {
  return (
    <WithTooltip
      text={{
        header: "Edit collection translation",
        body: "Updating this collection will affect this collection across all documents it's a part of.",
      }}
      placement="bottom"
    >
      <div>
        <InlineTextEditor
          injectedValue={text}
          onUpdate={onUpdate}
          placeholder="collection..."
          disabled={disableEditing}
          minWidth={30}
        >
          {({ isFocused: isEditing }) => (
            <>
              {!isText && !isEditing && !disableEditing ? (
                <MissingText tooltipText="missing collection translation" />
              ) : null}
            </>
          )}
        </InlineTextEditor>
      </div>
    </WithTooltip>
  );
};

const CollectionTranslationLanguage = ({
  languageId,
}: {
  languageId: string;
}) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return language ? (
    <CollectionTranslationLanguageUI languageText={language.name} />
  ) : (
    <SubContentMissingFromStore subContentType="language" />
  );
};

const CollectionTranslationLanguageUI = ({
  languageText,
}: {
  languageText: string;
}) => {
  return (
    <span css={[tw`capitalize text-gray-600 text-sm`]}>{languageText}</span>
  );
};

const InputWithSelect = () => {
  const [inputValue, setInputValue] = useState("");

  const [inputIsFocused, focusHandlers] = useFocused();

  return (
    <InputWithSelectUI
      input={
        <Input
          focusHandlers={focusHandlers}
          setValue={setInputValue}
          value={inputValue}
        />
      }
      language={<InputLanguage show={inputIsFocused} />}
      select={
        <CollectionsSelect
          query={inputValue}
          show={inputValue.length > 1 && inputIsFocused}
        />
      }
    />
  );
};

const InputWithSelectUI = ({
  input,
  language,
  select,
}: {
  input: ReactElement;
  language: ReactElement;
  select: ReactElement;
}) => {
  return (
    <div css={[tw`relative w-full`]}>
      <div css={[tw`relative inline-block`]}>
        {input}
        {language}
      </div>
      {select}
    </div>
  );
};

const Input = ({
  focusHandlers,
  setValue,
  value,
}: {
  focusHandlers: {
    onFocus: () => void;
    onBlur: () => void;
  };
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
}) => {
  const { onAddCollectionToDoc, docActiveLanguageId } = useComponentContext();

  const dispatch = useDispatch();

  const submitNewCollection = () => {
    const id = generateUId();
    dispatch(
      addCollection(
        createCollection({
          id: nanoid(),
          translationId: nanoid(),
          languageId: docActiveLanguageId,
        })
      )
    );
    onAddCollectionToDoc(id);
    setValue("");
  };

  return (
    <InputUI
      focusHandlers={focusHandlers}
      inputValue={value}
      onChange={(e) => setValue(e.target.value)}
      onSubmit={(e) => {
        e.preventDefault();
        submitNewCollection();
      }}
    />
  );
};

const inputId = "collection-input";

const InputUI = ({
  focusHandlers,
  inputValue,
  onChange,
  onSubmit,
}: {
  focusHandlers: {
    onFocus: () => void;
    onBlur: () => void;
  };
  inputValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div css={[tw`relative`]}>
        <input
          css={[
            tw`px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
          ]}
          id={inputId}
          value={inputValue}
          onChange={onChange}
          placeholder="Add a new collection..."
          type="text"
          autoComplete="off"
          {...focusHandlers}
        />
        <label
          css={[tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`]}
          htmlFor={inputId}
        >
          <Plus />
        </label>
      </div>
    </form>
  );
};

const InputLanguage = ({ show }: { show: boolean }) => {
  const { docActiveLanguageId } = useComponentContext();

  const language = useSelector((state) =>
    selectLanguageById(state, docActiveLanguageId)
  );

  return (
    <InputLanguageUI
      languageText={
        language ? (
          language.name
        ) : (
          <SubContentMissingFromStore subContentType="language" />
        )
      }
      show={show}
    />
  );
};

const InputLanguageUI = ({
  languageText,
  show,
}: {
  languageText: ReactElement | string;
  show: boolean;
}) => {
  return (
    <div
      css={[
        tw`absolute top-2 right-0 -translate-y-full flex items-center gap-xxs bg-white`,
        s_transition.toggleVisiblity(show),
        tw`transition-opacity duration-75 ease-in-out`,
      ]}
    >
      <span css={[tw`text-sm -translate-y-1 text-gray-400`]}>
        <TranslateIcon weight="light" />
      </span>
      <span css={[tw`capitalize text-gray-400 text-sm`]}>{languageText}</span>
    </div>
  );
};

const CollectionsSelect = ({
  query,
  show,
}: {
  query: string;
  show: boolean;
}) => {
  const allCollections = useSelector(selectCollections);

  const collectionsMatchingQuery = fuzzySearchCollections(
    query,
    allCollections
  );

  return (
    <CollectionsSelectUI
      collectionsMatchingQuery={
        <CollectionsMatchingQuery
          collectionMatches={collectionsMatchingQuery}
        />
      }
      show={show}
    />
  );
};

const CollectionsSelectUI = ({
  collectionsMatchingQuery,
  show,
}: {
  collectionsMatchingQuery: ReactElement;
  show: boolean;
}) => {
  return (
    <div
      css={[
        tw`absolute -bottom-2 translate-y-full w-full bg-white border-2 border-gray-200 rounded-sm py-sm text-sm shadow-lg`,
        show ? tw`opacity-100` : tw`opacity-0 h-0`,
        tw`transition-opacity duration-75 ease-linear`,
      ]}
    >
      {collectionsMatchingQuery}
    </div>
  );
};

const CollectionsMatchingQuery = ({
  collectionMatches: collectionMatches,
}: {
  collectionMatches: CollectionType[];
}) => {
  return (
    <CollectionsMatchingQueryUI
      areMatches={Boolean(collectionMatches.length)}
      collectionMatches={
        <>
          {collectionMatches.map((a) => (
            <CollectionMatch collection={a} key={a.id} />
          ))}
        </>
      }
    />
  );
};

const CollectionsMatchingQueryUI = ({
  areMatches,
  collectionMatches,
}: {
  areMatches: boolean;
  collectionMatches: ReactElement;
}) => {
  return (
    <div css={[tw`flex flex-col gap-xs items-start`]}>
      {areMatches ? (
        collectionMatches
      ) : (
        <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>
      )}
    </div>
  );
};

const CollectionMatch = ({ collection }: { collection: CollectionType }) => {
  const { docCollectionsById, onAddCollectionToDoc } = useComponentContext();
  const { id, translations } = collection;
  const isDocCollection = docCollectionsById.includes(id);

  return (
    <CollectionMatchUI
      addCollectionToDoc={() => !isDocCollection && onAddCollectionToDoc(id)}
      canAddToDoc={!isDocCollection}
      translations={<CollectionMatchTranslations translations={translations} />}
    />
  );
};

const CollectionMatchUI = ({
  addCollectionToDoc,
  canAddToDoc,
  translations,
}: {
  addCollectionToDoc: () => void;
  canAddToDoc: boolean;
  translations: ReactElement;
}) => {
  return (
    <WithTooltip
      text="add collection to document"
      type="action"
      isDisabled={!canAddToDoc}
    >
      <button
        css={[
          tw`text-left py-1 relative w-full px-sm`,
          !canAddToDoc && tw`pointer-events-none`,
        ]}
        className="group"
        onClick={addCollectionToDoc}
        type="button"
      >
        <span
          css={[
            tw`text-gray-600 group-hover:text-gray-800`,
            !canAddToDoc && tw`text-gray-400`,
          ]}
        >
          {translations}
        </span>
        {canAddToDoc ? (
          <span
            css={[
              s_transition.onGroupHover,
              tw`group-hover:z-50 bg-white absolute right-2 top-1/2 -translate-y-1/2 text-green-600`,
            ]}
          >
            <FilePlus weight="bold" />
          </span>
        ) : null}
      </button>
    </WithTooltip>
  );
};

// text overflow - have ellipsis ideally
const CollectionMatchTranslations = ({
  translations,
}: {
  translations: CollectionTranslationType[];
}) => {
  const validTranslations = translations.filter((t) => t.title.length);
  return (
    <CollectionMatchTranslationsUI
      translations={
        <>
          {validTranslations.map((t, i) => (
            <CollectionMatchTranslation index={i} translation={t} key={t.id} />
          ))}
        </>
      }
    />
  );
};

const CollectionMatchTranslationsUI = ({
  translations,
}: {
  translations: ReactElement;
}) => {
  return (
    <div css={[tw`flex items-center gap-xs overflow-hidden`]}>
      {translations}
    </div>
  );
};

const CollectionMatchTranslation = ({
  index,
  translation,
}: {
  index: number;
  translation: CollectionType["translations"][number];
}) => {
  return (
    <CollectionMatchTranslationUI
      isFirst={index === 0}
      text={translation.title}
    />
  );
};

const CollectionMatchTranslationUI = ({
  isFirst,
  text,
}: {
  isFirst: boolean;
  text: string;
}) => {
  return (
    <div css={[tw`flex items-center gap-xs`]}>
      {!isFirst ? <span css={[tw`w-[0.5px] h-[15px] bg-gray-200`]} /> : null}
      <p>{text}</p>
    </div>
  );
};
