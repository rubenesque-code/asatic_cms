import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { checkObjectHasField } from "^helpers/general";

import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { RecordedEvent } from "^types/recordedEvent";

import WithProximityPopover from "./WithProximityPopover";
import TranslationLanguageUI from "./content-list/TranslationLanguageUI";
import TranslationUI from "./content-list/TranslationUI";
import ListItem from "./content-list/ListItem";

import { s_popover } from "^styles/popover";

// todo: 'related content' doesn't quite capture what articles, blogs, etc. are. Alt: primary content; (primary) document.

type RelatedContent = Article | Blog | RecordedEvent;

type ContextValue = {
  contentType: string;
  relatedContent: RelatedContent[];
  relatedContentType: string;
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
  const { relatedContentType, contentType, relatedContent } =
    useComponentContext();

  const isRelatedContent = relatedContent.length;

  return (
    <PanelUI
      relatedContentType={relatedContentType}
      contentType={contentType}
      isRelatedContent={Boolean(isRelatedContent)}
    />
  );
};

const PanelUI = ({
  relatedContentType,
  contentType,
  isRelatedContent,
}: {
  relatedContentType: string;
  contentType: string;
  isRelatedContent: boolean;
}) => (
  <div
    css={[
      s_popover.panelContainer,
      isRelatedContent && tw`w-[90ch] max-w-[90vw]`,
    ]}
  >
    <div>
      <h4 css={[s_popover.title, tw`capitalize`]}>{relatedContentType}</h4>
      <p css={[s_popover.explanatoryText]}>
        {relatedContentType} connected to this {contentType}:
      </p>
    </div>
    {isRelatedContent ? <List /> : <NoItems />}
  </div>
);

const NoItems = () => <p css={[s_popover.emptyText]}>None yet</p>;

const List = () => {
  const { relatedContent } = useComponentContext();

  return (
    <ListUI
      items={relatedContent.map((item, i) => (
        <ListItem
          index={i}
          content={<RelatedContent relatedContentItem={item} />}
          key={item.id}
        />
      ))}
    />
  );
};

const ListUI = ({ items }: { items: ReactElement[] }) => (
  <div css={[tw`flex flex-col gap-sm`]}>{items}</div>
);

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
