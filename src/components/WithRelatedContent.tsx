import { createContext, ReactElement, useContext } from "react";

import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { RecordedEvent } from "^types/recordedEvent";

import { s_popover } from "^styles/popover";

import WithProximityPopover from "./WithProximityPopover";
import tw from "twin.macro";
import { checkObjectHasField } from "^helpers/general";
import LanguageError from "./LanguageError";
import { useSelector } from "^redux/hooks";
import { selectById as selectLanguageById } from "^redux/state/languages";
import MissingTranslation from "./MissingTranslation";

type RelatedContent = Article | Blog | RecordedEvent;

type ContextValue = {
  relatedContent: RelatedContent[];
  relatedContentType: string;
  subContentType: string;
};
const Context = createContext<ContextValue>({} as ContextValue);

const ComponentProvider = ({
  children,
  ...value
}: { children: ReactElement } & ContextValue) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useComponentContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

function WithRelatedContent({
  children,
  ...contextValue
}: {
  children: ReactElement;
} & ContextValue) {
  return (
    <WithProximityPopover
      panel={
        <ComponentProvider {...contextValue}>
          <Panel />
        </ComponentProvider>
      }
    >
      {children}
    </WithProximityPopover>
  );
}

export default WithRelatedContent;

const Panel = () => {
  const { relatedContentType, subContentType } = useComponentContext();

  return (
    <PanelUI
      relatedContentType={relatedContentType}
      subContentType={subContentType}
    />
  );
};

const PanelUI = ({
  relatedContentType,
  subContentType,
}: {
  relatedContentType: string;
  subContentType: string;
}) => (
  <div css={[s_popover.panelContainer, tw`w-[90ch] max-w-[90vw]`]}>
    <h4 css={[s_popover.title, tw`capitalize`]}>{relatedContentType}</h4>
    <p css={[s_popover.explanatoryText]}>
      {relatedContentType} related to this {subContentType}:
    </p>
    <List />
  </div>
);

const List = () => {
  const { relatedContent } = useComponentContext();

  return relatedContent.length ? (
    <ListUI
      items={relatedContent.map((item, i) => (
        <ListItem
          index={i}
          relatedContent={<RelatedContent relatedContentItem={item} />}
          key={item.id}
        />
      ))}
    />
  ) : (
    <NoItems />
  );
};

const ListUI = ({ items }: { items: ReactElement[] }) => <div>{items}</div>;

const NoItems = () => <p>None yet</p>;

const ListItem = ({
  index,
  relatedContent,
}: {
  index: number;
  relatedContent: ReactElement;
}) => {
  const number = index + 1;

  return <ListItemUI number={number} relatedContent={relatedContent} />;
};

const ListItemUI = ({
  number,
  relatedContent,
}: {
  number: number;
  relatedContent: ReactElement;
}) => (
  <div css={[tw`relative flex`]} className="group">
    <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
    {relatedContent}
  </div>
);

const RelatedContent = ({
  relatedContentItem,
}: {
  relatedContentItem: RelatedContent;
}) => {
  const { translations } = relatedContentItem;

  return (
    <RelatedContentUI
      translations={translations.map((translation) => (
        <RelatedContentTranslation
          translation={translation}
          key={translation.id}
        />
      ))}
    />
  );
};

const RelatedContentUI = ({
  translations,
}: {
  translations: ReactElement[];
}) => <div css={[tw`flex items-center gap-sm`]}>{translations}</div>;

const RelatedContentTranslation = ({
  translation,
}: {
  translation: RelatedContent["translations"][number];
}) => {
  const { title, languageId } = translation;

  return (
    <RelatedContentTranslationUI
      handleLanguage={<HandleLanguage languageId={languageId} />}
      title={title}
    />
  );
};

const RelatedContentTranslationUI = ({
  handleLanguage,
  title,
}: {
  handleLanguage: ReactElement;
  title: string | undefined;
}) => (
  <div>
    {title ? (
      <span>{title}</span>
    ) : (
      <span css={[tw`flex`]}>
        <span>...</span>
        <MissingTranslation tooltipText="missing translation" />
      </span>
    )}
    {handleLanguage}
  </div>
);

const HandleLanguage = ({ languageId }: { languageId: string }) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return language ? (
    <ValidLanguage name={language.name} />
  ) : (
    <MissingLanguage />
  );
};

const ValidLanguage = ({ name }: { name: string }) => <p>{name}</p>;

const MissingLanguage = () => (
  <div>
    <span>error</span>
    <LanguageError />
  </div>
);
