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
  FileMinus,
  FilePlus,
  Plus,
  Translate,
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

  return (
    <PanelUI
      areDocCollections={areDocCollections}
      docCollectionsList={
        areDocCollections ? (
          <CollectionsListUI
            listItems={
              <>
                {docCollectionsById.map((id, i) => (
                  <CollectionsListItem
                    docCollectionId={id}
                    index={i}
                    key={id}
                  />
                ))}
              </>
            }
          />
        ) : null
      }
      inputWithSelect={<CollectionsInputWithSelect />}
    />
  );
};

const PanelUI = ({
  areDocCollections,
  docCollectionsList,
  inputWithSelect,
}: {
  areDocCollections: boolean;
  docCollectionsList: ReactElement | null;
  inputWithSelect: ReactElement;
}) => (
  <div css={[s_popover.panelContainer]}>
    <div>
      <h4 css={[tw`font-medium text-lg`]}>Collections</h4>
      <p css={[tw`text-gray-600 mt-xs text-sm`]}>
        Collections allow groups of content to be grouped under a topic (rather
        than a subject). You can optionally relate a collection to a subject.
      </p>
      {!areDocCollections ? (
        <p css={[tw`text-gray-800 mt-xs text-sm`]}>None yet.</p>
      ) : null}
    </div>
    <div css={[tw`flex flex-col gap-lg items-start`]}>
      {docCollectionsList}
      {inputWithSelect}
    </div>
  </div>
);

const CollectionsListUI = ({ listItems }: { listItems: ReactElement }) => (
  <div css={[tw`flex flex-col gap-md`]}>{listItems}</div>
);

const CollectionsListItem = ({
  docCollectionId,
  index,
}: {
  docCollectionId: string;
  index: number;
}) => {
  const number = index + 1;

  return (
    <CollectionsListItemUI
      collection={<Collection collectionId={docCollectionId} />}
      number={number}
      removeFromDocButton={<RemoveFromDoc docCollectionId={docCollectionId} />}
      subject={<Subject />}
    />
  );
};

const CollectionsListItemUI = ({
  collection,
  number,
  removeFromDocButton,
  subject,
}: {
  number: number;
  collection: ReactElement;
  removeFromDocButton: ReactElement;
  subject: ReactElement;
}) => {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
      <div css={[tw`flex flex-col gap-xxs`]}>
        <div css={[tw`relative flex gap-sm`]}>
          {removeFromDocButton}
          <div
            css={[
              tw`translate-x-[-40px] group-hover:z-40 group-hover:translate-x-0 transition-transform duration-75 ease-in delay-300`,
            ]}
          >
            {collection}
          </div>
        </div>
        {subject}
      </div>
    </div>
  );
};

const Subject = () => {
  const [{ subjectId }] = useCollectionContext();

  return (
    <SubjectUI
      subject={
        subjectId ? (
          <SubjectPopulated subjectId={subjectId} />
        ) : (
          <SubjectEmptyUI />
        )
      }
    />
  );
};

const SubjectUI = ({ subject }: { subject: ReactElement }) => (
  <div css={[tw`flex items-center gap-sm ml-xs`]}>
    <h4 css={[tw`text-gray-700 uppercase text-xs`]}>Subject:</h4>
    {subject}
  </div>
);

const SubjectEmptyUI = () => (
  <div>
    <p css={[tw`text-gray-600 text-sm`]}>None</p>
  </div>
);

const SubjectPopulated = ({ subjectId }: { subjectId: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return (
    <SubjectPopulatedUI
      handleSubject={subject ? <SubjectValid /> : <SubjectInvalidUI />}
    />
  );
};

const SubjectPopulatedUI = ({
  handleSubject,
}: {
  handleSubject: ReactElement;
}) => <div>{handleSubject}</div>;

const SubjectInvalidUI = () => <div>Invalid</div>;

const SubjectValid = () => {
  return <SubjectValidUI />;
};

const SubjectValidUI = () => <div>Valid</div>;

const Collection = ({ collectionId }: { collectionId: string }) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  );

  return collection ? (
    <CollectionProvider collection={collection}>
      <CollectionTranslations />
    </CollectionProvider>
  ) : (
    <CollectionErrorUI />
  );
};

const RemoveFromDoc = ({ docCollectionId }: { docCollectionId: string }) => {
  const { onRemoveCollectionFromDoc } = useWithCollectionsContext();
  const removeFromDoc = () => onRemoveCollectionFromDoc(docCollectionId);
  return (
    <RemoveFromDocUI
      removeFromDoc={removeFromDoc}
      tooltipText="remove collection from document"
      warningText="Remove collection from document?"
    />
  );
};

const RemoveFromDocUI = ({
  removeFromDoc,
  tooltipText,
  warningText,
}: {
  removeFromDoc: () => void;
  tooltipText: string;
  warningText: string;
}) => {
  return (
    <WithWarning
      callbackToConfirm={removeFromDoc}
      warningText={{ heading: warningText }}
      type="moderate"
    >
      {({ isOpen: warningIsOpen }) => (
        <WithTooltip
          text={tooltipText}
          placement="top"
          isDisabled={warningIsOpen}
          type="action"
        >
          <button
            css={[
              tw`group-hover:visible group-hover:opacity-100 invisible opacity-0 transition-opacity ease-in-out duration-75`,
              tw`text-gray-600 p-xxs hover:bg-gray-100 hover:text-red-warning active:bg-gray-200 rounded-full grid place-items-center`,
            ]}
            type="button"
          >
            <FileMinus />
          </button>
        </WithTooltip>
      )}
    </WithWarning>
  );
};

const CollectionErrorUI = () => {
  return (
    <WithTooltip
      text={{
        header: "Collection error",
        body: "An collection was added to this document that can't be found. Try refreshing the page. If the problem persists, contact the site developer.",
      }}
    >
      <span css={[tw`text-red-500 bg-white group-hover:z-50`]}>
        <WarningCircle />
      </span>
    </WithTooltip>
  );
};

const CollectionTranslations = () => {
  const { docLanguagesById } = useWithCollectionsContext();
  const [{ translations }] = useCollectionContext();

  const translationsWithLanguageNotUsedInDoc = translations.filter(
    (t) => !docLanguagesById.includes(t.languageId)
  );

  return (
    <CollectionTranslationsUI
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
          {translationsWithLanguageNotUsedInDoc.map((t, i) => (
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
  docLanguageTranslations,
  nonDocLanguageTranslations,
}: {
  docLanguageTranslations: ReactElement;
  nonDocLanguageTranslations: ReactElement;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm flex-wrap`]}>
      {docLanguageTranslations}
      <div css={[tw`flex items-center gap-xxs ml-md`]}>
        <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
        <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
      </div>
      {nonDocLanguageTranslations}
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
  const [{ id: collectionId }] = useCollectionContext();

  const dispatch = useDispatch();
  const isFirst = Boolean(index === 0);

  const handleUpdateCollectionTranslation = (text: string) => {
    if (translation) {
      dispatch(
        updateText({ id: collectionId, translationId: translation.id, text })
      );
    } else {
      dispatch(addTranslation({ id: collectionId, languageId, text }));
    }
  };
  const translationText = translation?.text;

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
}: // input
{
  isDocLanguage: boolean;
  isFirst: boolean;
  language: ReactElement;
  translationText: ReactElement;
  // input: ReactElement
}) => {
  return (
    <div css={[tw`flex gap-sm items-center`]}>
      {!isFirst ? <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} /> : null}
      <div
        css={[
          tw`flex gap-xs`,
          !isDocLanguage && tw`pointer-events-none opacity-40`,
        ]}
      >
        {/* <p>{translationText}</p> */}
        <span>{translationText}</span>
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <Translate />
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
    <LanguageError />
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

const inputId = "collection-input";

const CollectionsInputWithSelect = () => {
  const [inputValue, setInputValue] = useState("");

  const [inputIsFocused, focusHandlers] = useFocused();

  return (
    <CollectionsInputWithSelectUI
      input={
        <CollectionInput
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

const CollectionsInputWithSelectUI = ({
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

const CollectionInput = ({
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
    <CollectionInputUI
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

const CollectionInputUI = ({
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
        <Translate weight="light" />
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
