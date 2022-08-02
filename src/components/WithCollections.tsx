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
  ArrowElbowDownRight as ArrowElbowDownRightIcon,
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
  selectAll,
  addOne,
  selectById as selectCollectionById,
  addTranslation,
  updateText,
} from "^redux/state/collections";
import { selectById as selectLanguageById } from "^redux/state/languages";
import { selectById as selectSubjectById } from "^redux/state/subjects";

import useFocused from "^hooks/useFocused";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";
import InlineTextEditor from "./editors/Inline";
import LanguageError from "./LanguageError";
import MissingText from "./MissingText";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import {
  Collection as CollectionType,
  CollectionTranslation as CollectionTranslationType,
} from "^types/collection";
import {
  CollectionProvider,
  useCollectionContext,
} from "^context/CollectionContext";
import { fuzzySearchCollections } from "^helpers/collections";
import { SubjectProvider } from "^context/SubjectContext";
import WithDocSubjectsInitial from "./WithSubjects";
import { ContentMenuButton, ContentMenuVerticalBar } from "./menus/Content";
import MissingTranslation from "./MissingTranslation";
import useIsMissingSubjectTranslation from "^hooks/useIsMissingSubjectTranslation";

type TopProps = {
  docActiveLanguageId: string;
  docCollectionsById: string[];
  docLanguagesById: string[];
  onAddCollectionToDoc: (collectionId: string) => void;
  onRemoveCollectionFromDoc: (collectionId: string) => void;
};

type Value = TopProps;
const Context = createContext<Value>({} as Value);

const Provider = ({
  children,
  ...value
}: { children: ReactElement } & Value) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useWithCollectionsContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useWithCollectionsContext must be used within its provider!"
    );
  }
  return context;
};

const WithCollections = ({
  children,
  ...topProps
}: {
  children: ReactElement;
} & TopProps) => {
  return (
    <WithProximityPopover
      panelContentElement={
        <Provider {...topProps}>
          <Panel />
        </Provider>
      }
      panelMaxWidth={tw`max-w-[80vw]`}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithCollections;

const Panel = () => {
  const { docCollectionsById } = useWithCollectionsContext();

  const areDocCollections = Boolean(docCollectionsById.length);

  return <PanelUI areDocCollections={areDocCollections} />;
};

const PanelUI = ({ areDocCollections }: { areDocCollections: boolean }) => (
  <div css={[s_popover.panelContainer]}>
    <div>
      <h4 css={[tw`font-medium text-lg`]}>Collections</h4>
      <p css={[tw`text-gray-600 mt-xs text-sm`]}>
        Collections allow content to be grouped under a topic (as opposed to a
        subject, which is broader). A collection can optionally be part of a
        subject(s).
      </p>
      {!areDocCollections ? (
        <p css={[tw`text-gray-800 mt-xs text-sm`]}>None yet.</p>
      ) : null}
    </div>
    <div css={[tw`flex flex-col gap-md items-start`]}>
      <List />
      <InputWithSelect />
    </div>
  </div>
);

const List = () => {
  const { docCollectionsById } = useWithCollectionsContext();

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
      collection={
        <HandleCollectionValidity docCollectionId={docCollectionId} />
      }
      number={number}
    />
  );
};

const ListItemUI = ({
  collection,
  number,
}: {
  collection: ReactElement;
  number: number;
}) => {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
      {collection}
    </div>
  );
};

const HandleCollectionValidity = ({
  docCollectionId,
}: {
  docCollectionId: string;
}) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, docCollectionId)
  );

  return collection ? (
    <CollectionProvider collection={collection}>
      <ValidCollection />
    </CollectionProvider>
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
  const { onRemoveCollectionFromDoc } = useWithCollectionsContext();

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
      <ContentMenuButton
        tooltipProps={{
          isDisabled: warningIsOpen,
          placement: "top",
          text: tooltipText,
          type: "action",
        }}
      >
        <FileMinusIcon />
      </ContentMenuButton>
    )}
  </WithWarning>
);

const ValidCollection = () => {
  const [{ subjectsById: collectionSubjectsById }] = useCollectionContext();
  const { docLanguagesById } = useWithCollectionsContext();

  const isMissingSubjectTranslationForDocLanguages =
    useIsMissingSubjectTranslation({
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
  <div css={[tw`flex items-center gap-sm`]} className="group">
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
  const [{ id }] = useCollectionContext();

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
    <ContentMenuVerticalBar />
  </div>
);

const EditSubjectsButton = () => {
  const { docActiveLanguageId, docLanguagesById } = useWithCollectionsContext();
  const [{ subjectsById }, { removeSubject, addSubject }] =
    useCollectionContext();

  return (
    <WithDocSubjectsInitial
      docActiveLanguageId={docActiveLanguageId}
      docLanguagesById={docLanguagesById}
      docSubjectsById={subjectsById}
      docType="collection"
      onAddSubjectToDoc={(subjectId) => addSubject({ subjectId })}
      onRemoveSubjectFromDoc={(subjectId) => removeSubject({ subjectId })}
    >
      {({ isMissingTranslation }) => (
        <EditSubjectsButtonUI isMissingTranslation={isMissingTranslation} />
      )}
    </WithDocSubjectsInitial>
  );
};

const EditSubjectsButtonUI = ({
  isMissingTranslation,
}: {
  isMissingTranslation: boolean;
}) => (
  <div css={[tw`relative flex items-center`]}>
    <ContentMenuButton
      tooltipProps={{
        text: "edit the subject(s) this  collection is part of",
        placement: "top",
        type: "action",
      }}
    >
      <BooksIcon />
    </ContentMenuButton>
    {isMissingTranslation ? (
      <div css={[tw`-translate-y-1 scale-90`]}>
        <MissingTranslation tooltipText="missing subject translation" />
      </div>
    ) : null}
  </div>
);

const CollectionTranslations = () => {
  return <CollectionTranslationsUI />;
};

const CollectionTranslationsUI = () => <div>Translations</div>;

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
  const { docActiveLanguageId, onAddCollectionToDoc } =
    useWithCollectionsContext();

  const dispatch = useDispatch();

  const submitNewCollection = () => {
    const id = generateUId();
    dispatch(addOne({ id, text: value, languageId: docActiveLanguageId }));
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
  const { docActiveLanguageId } = useWithCollectionsContext();

  const language = useSelector((state) =>
    selectLanguageById(state, docActiveLanguageId)
  );

  return (
    <InputLanguageUI
      languageText={language ? language.name : <LanguageError />}
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
  const allCollections = useSelector(selectAll);

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
  const { docCollectionsById, onAddCollectionToDoc } =
    useWithCollectionsContext();
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
  const validTranslations = translations.filter((t) => t.text.length);
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
      text={translation.text}
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
