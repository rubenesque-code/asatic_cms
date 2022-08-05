import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { checkObjectHasField } from "^helpers/general";

import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { RecordedEvent } from "^types/recordedEvent";

import WithProximityPopover from "./WithProximityPopover";

import { s_popover } from "^styles/popover";
import TranslationLanguageUI from "./content-list/TranslationLanguageUI";
import TranslationUI from "./content-list/TranslationUI";
import ListItem from "./content-list/ListItem";

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
    <div>
      <h4 css={[s_popover.title, tw`capitalize`]}>{relatedContentType}</h4>
      <p css={[s_popover.explanatoryText]}>
        {relatedContentType} connected to this {subContentType}:
      </p>
    </div>
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
          content={<RelatedContent relatedContentItem={item} />}
          key={item.id}
        />
      ))}
    />
  ) : (
    <NoItems />
  );
};

const ListUI = ({ items }: { items: ReactElement[] }) => (
  <div css={[tw`flex flex-col gap-sm`]}>{items}</div>
);

const NoItems = () => <p>None yet</p>;

const RelatedContent = ({
  relatedContentItem,
}: {
  relatedContentItem: RelatedContent;
}) => {
  const { translations } = relatedContentItem;

  return (
    <RelatedContentUI
      translations={translations.map((translation, i) => (
        <RelatedContentTranslation
          index={i}
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
  index,
  translation,
}: {
  index: number;
  translation: RelatedContent["translations"][number];
}) => {
  const { title, languageId } = translation;

  return (
    <TranslationUI
      isNotFirstInList={index !== 0}
      translationLanguage={<TranslationLanguage languageId={languageId} />}
      translationTitle={title}
    />
  );
};

const TranslationLanguage = ({ languageId }: { languageId: string }) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return <TranslationLanguageUI language={language} />;
};
