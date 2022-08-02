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
  selectEntitiesByIds as selectSubjectsByIds,
  addOne,
  selectById,
  addTranslation,
  updateText,
} from "^redux/state/subjects";
import { selectById as selectLanguageById } from "^redux/state/languages";

import useFocused from "^hooks/useFocused";

import { fuzzySearchSubjects } from "^helpers/subjects";

import { Subject as SubjectType } from "^types/subject";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";
import InlineTextEditor from "./editors/Inline";
import LanguageError from "./LanguageError";
import MissingText from "./MissingText";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import { SubjectProvider, useSubjectContext } from "^context/SubjectContext";
import { checkObjectHasField } from "^helpers/general";
import useMissingSubjectTranslation from "^hooks/useIsMissingSubjectTranslation";

// todo: missing subject error message
type TopProps = {
  docActiveLanguageId: string;
  docLanguagesById: string[];
  docSubjectsById: string[];
  docType: string;
  onAddSubjectToDoc: (subjectId: string) => void;
  onRemoveSubjectFromDoc: (subjectId: string) => void;
};

type Value = TopProps;
const Context = createContext<Value>({} as Value);

const Provider = ({
  children,
  ...value
}: {
  children: ReactElement;
} & Value) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useWithSubjectsContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useWithSubjectsContext must be used within its provider!");
  }
  return context;
};

const WithDocSubjects = ({
  children,
  ...props
}: {
  children:
    | ReactElement
    | (({
        isMissingTranslation,
      }: {
        isMissingTranslation: boolean;
      }) => ReactElement);
} & TopProps) => {
  const { docLanguagesById, docSubjectsById } = props;

  const isMissingTranslation = useMissingSubjectTranslation({
    languagesById: docLanguagesById,
    subjectsById: docSubjectsById,
  });

  return (
    <WithProximityPopover
      panelContentElement={
        <Provider {...props}>
          <Panel />
        </Provider>
      }
      panelMaxWidth={tw`max-w-[80vw]`}
    >
      {typeof children === "function"
        ? children({ isMissingTranslation })
        : children}
    </WithProximityPopover>
  );
};

export default WithDocSubjects;

const Panel = () => {
  const { docSubjectsById, docType } = useWithSubjectsContext();

  const areDocSubjects = Boolean(docSubjectsById.length);

  return (
    <PanelUI
      areDocSubjects={areDocSubjects}
      docSubjectsList={
        <SubjectsListUI
          listItems={
            areDocSubjects ? (
              <>
                {docSubjectsById.map((id, i) => (
                  <SubjectsListItem docSubjectId={id} index={i} key={id} />
                ))}
              </>
            ) : null
          }
        />
      }
      docType={docType}
      inputWithSelect={<SubjectsInputWithSelect />}
    />
  );
};

const PanelUI = ({
  areDocSubjects,
  docSubjectsList,
  docType,
  inputWithSelect,
}: {
  areDocSubjects: boolean;
  docSubjectsList: ReactElement;
  docType: string;
  inputWithSelect: ReactElement;
}) => (
  <div css={[s_popover.panelContainer]}>
    <div>
      <h4 css={[tw`font-medium text-lg`]}>Subjects</h4>
      <p css={[tw`text-gray-600 mt-xs text-sm`]}>
        Subjects are broad - such as biology, art or politics. They will appear
        as a list on the website.
      </p>
      {!areDocSubjects ? (
        <p css={[tw`text-gray-800 mt-sm text-sm`]}>
          None attached to this {docType} yet.
        </p>
      ) : null}
    </div>
    <div css={[tw`flex flex-col gap-lg items-start`]}>
      {docSubjectsList}
      {inputWithSelect}
    </div>
  </div>
);

const SubjectsListUI = ({ listItems }: { listItems: ReactElement | null }) => (
  <div css={[tw`flex flex-col gap-md`]}>{listItems}</div>
);

const SubjectsListItem = ({
  docSubjectId,
  index,
}: {
  docSubjectId: string;
  index: number;
}) => {
  const number = index + 1;

  return (
    <SubjectsListItemUI
      subject={<Subject subjectId={docSubjectId} />}
      number={number}
      removeFromDocButton={<RemoveFromDoc docSubjectId={docSubjectId} />}
    />
  );
};

const SubjectsListItemUI = ({
  number,
  removeFromDocButton,
  subject,
}: {
  number: number;
  subject: ReactElement;
  removeFromDocButton: ReactElement;
}) => {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
      <div css={[tw`relative flex gap-sm`]}>
        {removeFromDocButton}
        <div
          css={[
            // * group-hover:z-50 for input tooltip; translate-x value is from the size of removesubject button and flex spacing.
            tw`translate-x-[-40px] group-hover:z-40 group-hover:translate-x-0 transition-transform duration-75 ease-in delay-300`,
          ]}
        >
          {subject}
        </div>
      </div>
    </div>
  );
};

const Subject = ({ subjectId }: { subjectId: string }) => {
  const subject = useSelector((state) => selectById(state, subjectId));

  return subject ? (
    <SubjectProvider subject={subject}>
      <SubjectTranslations />
    </SubjectProvider>
  ) : (
    <SubjectErrorUI />
  );
};

const RemoveFromDoc = ({ docSubjectId }: { docSubjectId: string }) => {
  const { onRemoveSubjectFromDoc } = useWithSubjectsContext();

  const removeFromDoc = () => onRemoveSubjectFromDoc(docSubjectId);

  return (
    <RemoveFromDocUI
      removeFromDoc={removeFromDoc}
      tooltipText="remove subject from document"
      warningText="Remove subject from document?"
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

const SubjectErrorUI = () => (
  <WithTooltip
    text={{
      header: "Subject error",
      body: "An subject was added to this document that can't be found. Try refreshing the page. If the problem persists, contact the site developer.",
    }}
  >
    <span css={[tw`text-red-500 bg-white group-hover:z-50`]}>
      <WarningCircle />
    </span>
  </WithTooltip>
);

const SubjectTranslations = () => {
  const { docLanguagesById } = useWithSubjectsContext();
  const [{ translations }] = useSubjectContext();

  const nonDocLanguageTranslations = translations.filter(
    (t) => !docLanguagesById.includes(t.languageId)
  );

  return (
    <SubjectTranslationsUI
      docLanguageTranslations={
        <>
          {docLanguagesById.map((languageId, i) => (
            <SubjectTranslation
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
          {nonDocLanguageTranslations.map((t, i) => (
            <SubjectTranslation
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

const SubjectTranslationsUI = ({
  docLanguageTranslations,
  nonDocLanguageTranslations,
}: {
  docLanguageTranslations: ReactElement;
  nonDocLanguageTranslations: ReactElement;
}) => (
  <div css={[tw`flex items-center gap-sm flex-wrap`]}>
    {docLanguageTranslations}
    <div css={[tw`flex items-center gap-xxs ml-md`]}>
      <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
      <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
    </div>
    {nonDocLanguageTranslations}
  </div>
);

const SubjectTranslation = ({
  index,
  languageId,
  translation,
  type,
}: {
  index: number;
  languageId: string;
  translation: SubjectType["translations"][number] | undefined;
  type: "doc" | "non-doc";
}) => {
  const [{ id: subjectId }] = useSubjectContext();

  const dispatch = useDispatch();
  const isFirst = Boolean(index === 0);

  const handleUpdateSubjectTranslation = (text: string) => {
    if (translation) {
      dispatch(
        updateText({ id: subjectId, translationId: translation.id, text })
      );
    } else {
      dispatch(addTranslation({ id: subjectId, languageId, text }));
    }
  };
  const translationText = translation?.text;

  return (
    <SubjectTranslationUI
      isDocLanguage={type === "doc"}
      isFirst={isFirst}
      language={<SubjectTranslationLanguage languageId={languageId} />}
      translationText={
        <SubjectTranslationText
          onUpdate={handleUpdateSubjectTranslation}
          text={translationText}
          translationType={type}
        />
      }
    />
  );
};

const SubjectTranslationUI = ({
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
      {!isFirst ? <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} /> : null}
      <div
        css={[
          tw`flex gap-xs`,
          !isDocLanguage && tw`pointer-events-none opacity-40`,
        ]}
      >
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

const SubjectTranslationText = ({
  onUpdate,
  text,
  translationType,
}: {
  onUpdate: (text: string) => void;
  text: string | undefined;
  translationType: "doc" | "non-doc";
}) => {
  return (
    <SubjectTranslationTextUI
      disableEditing={translationType === "non-doc"}
      isText={Boolean(text?.length)}
      onUpdate={onUpdate}
      text={text || ""}
    />
  );
};

const SubjectTranslationTextUI = ({
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
        header: "Edit subject translation",
        body: "Updating this subject will affect this subject across all documents it's a part of.",
      }}
      placement="bottom"
    >
      <div>
        <InlineTextEditor
          injectedValue={text}
          onUpdate={onUpdate}
          placeholder="subject..."
          disabled={disableEditing}
          minWidth={30}
        >
          {({ isFocused: isEditing }) => (
            <>
              {!isText && !isEditing && !disableEditing ? (
                <MissingText tooltipText="missing subject translation" />
              ) : null}
            </>
          )}
        </InlineTextEditor>
      </div>
    </WithTooltip>
  );
};

const SubjectTranslationLanguage = ({ languageId }: { languageId: string }) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return language ? (
    <SubjectTranslationLanguageUI languageText={language.name} />
  ) : (
    <LanguageError />
  );
};

const SubjectTranslationLanguageUI = ({
  languageText,
}: {
  languageText: string;
}) => {
  return (
    <span css={[tw`capitalize text-gray-600 text-sm`]}>{languageText}</span>
  );
};

const inputId = "subject-input";

const SubjectsInputWithSelect = () => {
  const [inputValue, setInputValue] = useState("");

  const [inputIsFocused, focusHandlers] = useFocused();

  return (
    <SubjectsInputWithSelectUI
      input={
        <SubjectInput
          focusHandlers={focusHandlers}
          setValue={setInputValue}
          value={inputValue}
        />
      }
      language={<InputLanguage show={inputIsFocused} />}
      select={
        <SubjectsSelect
          query={inputValue}
          show={inputValue.length > 1 && inputIsFocused}
        />
      }
    />
  );
};

const SubjectsInputWithSelectUI = ({
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

const SubjectInput = ({
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
  const { docActiveLanguageId, onAddSubjectToDoc } = useWithSubjectsContext();

  const dispatch = useDispatch();

  const submitNewSubject = () => {
    const id = generateUId();
    dispatch(addOne({ id, text: value, languageId: docActiveLanguageId }));
    onAddSubjectToDoc(id);
    setValue("");
  };

  return (
    <SubjectInputUI
      focusHandlers={focusHandlers}
      inputValue={value}
      onChange={(e) => setValue(e.target.value)}
      onSubmit={(e) => {
        e.preventDefault();
        submitNewSubject();
      }}
    />
  );
};

const SubjectInputUI = ({
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
          placeholder="Add a new subject..."
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
  const { docActiveLanguageId } = useWithSubjectsContext();

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

const SubjectsSelect = ({ query, show }: { query: string; show: boolean }) => {
  const allSubjects = useSelector(selectAll);

  const subjectsMatchingQuery = fuzzySearchSubjects(query, allSubjects);

  return (
    <SubjectsSelectUI
      subjectsMatchingQuery={
        <SubjectsMatchingQuery subjectMatches={subjectsMatchingQuery} />
      }
      show={show}
    />
  );
};

const SubjectsSelectUI = ({
  subjectsMatchingQuery,
  show,
}: {
  subjectsMatchingQuery: ReactElement;
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
      {subjectsMatchingQuery}
    </div>
  );
};

const SubjectsMatchingQuery = ({
  subjectMatches,
}: {
  subjectMatches: SubjectType[];
}) => {
  return (
    <SubjectsMatchingQueryUI
      areMatches={Boolean(subjectMatches.length)}
      subjectMatches={
        <>
          {subjectMatches.map((a) => (
            <SubjectMatch subject={a} key={a.id} />
          ))}
        </>
      }
    />
  );
};

const SubjectsMatchingQueryUI = ({
  areMatches,
  subjectMatches,
}: {
  areMatches: boolean;
  subjectMatches: ReactElement;
}) => {
  return (
    <div css={[tw`flex flex-col gap-xs items-start`]}>
      {areMatches ? (
        subjectMatches
      ) : (
        <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>
      )}
    </div>
  );
};

const SubjectMatch = ({ subject }: { subject: SubjectType }) => {
  const { docSubjectsById, onAddSubjectToDoc } = useWithSubjectsContext();
  const { id, translations } = subject;
  const isDocSubject = docSubjectsById.includes(id);

  return (
    <SubjectMatchUI
      addSubjectToDoc={() => !isDocSubject && onAddSubjectToDoc(id)}
      canAddToDoc={!isDocSubject}
      translations={<SubjectMatchTranslations translations={translations} />}
    />
  );
};

const SubjectMatchUI = ({
  addSubjectToDoc,
  canAddToDoc,
  translations,
}: {
  addSubjectToDoc: () => void;
  canAddToDoc: boolean;
  translations: ReactElement;
}) => {
  return (
    <WithTooltip
      text="add subject to document"
      type="action"
      isDisabled={!canAddToDoc}
    >
      <button
        css={[
          tw`text-left py-1 relative w-full px-sm`,
          !canAddToDoc && tw`pointer-events-none`,
        ]}
        className="group"
        onClick={addSubjectToDoc}
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
const SubjectMatchTranslations = ({
  translations,
}: {
  translations: SubjectType["translations"][number][];
}) => {
  const validTranslations = translations.filter((t) => t.text.length);
  return (
    <SubjectMatchTranslationsUI
      translations={
        <>
          {validTranslations.map((t, i) => (
            <SubjectMatchTranslation index={i} translation={t} key={t.id} />
          ))}
        </>
      }
    />
  );
};

const SubjectMatchTranslationsUI = ({
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

const SubjectMatchTranslation = ({
  index,
  translation,
}: {
  index: number;
  translation: SubjectType["translations"][number];
}) => {
  return (
    <SubjectMatchTranslationUI isFirst={index === 0} text={translation.text} />
  );
};

const SubjectMatchTranslationUI = ({
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
