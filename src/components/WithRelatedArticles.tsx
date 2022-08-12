import { ReactElement } from "react";
import tw from "twin.macro";
import { Translate } from "phosphor-react";

import { useSelector } from "^redux/hooks";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { Article } from "^types/article";
import { Language } from "^types/language";

import SubContentMissingFromStore from "./SubContentMissingFromStore";
import WithProximityPopover from "./WithProximityPopover";
import MissingText from "./MissingText";

import { s_popover } from "^styles/popover";

const WithRelatedArticles = ({
  articles,
  children,
  ...panelUIProps
}: {
  articles: Article[];
  children: ReactElement;
} & PanelUIPropsPassedFromTop) => {
  return (
    <WithProximityPopover
      panel={<Panel articles={articles} {...panelUIProps} />}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithRelatedArticles;

const Panel = ({
  articles,
  ...panelUIProps
}: {
  articles: Article[];
} & PanelUIPropsPassedFromTop) => {
  return (
    <PanelUI
      articlesList={
        <ArticlesListUI>
          <>
            {articles.map((article, i) => (
              <ArticleUI
                article={
                  <>
                    {article.translations.map((translation, i) => (
                      <ArticleTranslation
                        isFirst={i === 0}
                        translation={translation}
                        key={translation.id}
                      />
                    ))}
                  </>
                }
                listNum={i + 1}
                key={article.id}
              />
            ))}
          </>
        </ArticlesListUI>
      }
      isArticle={Boolean(articles.length)}
      {...panelUIProps}
    />
  );
};

type PanelUIPropsPassedFromTop = {
  title: string;
  subTitleText: {
    noArticles: string;
    withArticles: string;
  };
};

const PanelUI = ({
  articlesList,
  isArticle,
  title,
  subTitleText,
}: PanelUIPropsPassedFromTop & {
  articlesList: ReactElement;
  isArticle: boolean;
}) => {
  return (
    <div css={[s_popover.panelContainer]}>
      <div>
        <h4 css={[s_popover.title, tw`text-base`]}>{title}</h4>
        <p css={[tw`text-gray-600 text-sm mt-xxs`]}>
          {!isArticle ? subTitleText.noArticles : subTitleText.withArticles}
        </p>
      </div>
      <div>{articlesList}</div>
    </div>
  );
};

const ArticlesListUI = ({ children }: { children: ReactElement }) => {
  return <div css={[tw`mt-xs flex flex-col gap-sm`]}>{children}</div>;
};

const ArticleUI = ({
  article,
  listNum,
}: {
  article: ReactElement;
  listNum: number;
}) => {
  return (
    <div css={[tw`flex gap-xs`]}>
      <div css={[tw`text-gray-600`]}>{listNum}.</div>
      <div css={[tw`flex-grow flex items-center gap-sm flex-wrap`]}>
        {article}
        <div css={[tw`flex items-center gap-xxs`]}>
          <div css={[tw`h-[20px] w-[0.5px] bg-gray-300`]} />
          <div css={[tw`h-[20px] w-[0.5px] bg-gray-300`]} />
        </div>
      </div>
    </div>
  );
};

const ArticleTranslation = ({
  isFirst,
  translation,
}: {
  isFirst: boolean;
  translation: Article["translations"][number];
}) => {
  const { languageId, title } = translation;

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return (
    <ArticleTranslationUI
      isFirst={isFirst}
      language={<ArticleLanguageUI language={language} />}
      title={title}
    />
  );
};

const ArticleTranslationUI = ({
  isFirst,
  title,
  language,
}: {
  isFirst: boolean;
  title: string | undefined;
  language: ReactElement;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm`]} className="group">
      {!isFirst ? <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} /> : null}
      <div css={[tw`flex gap-xs`]}>
        {title ? title : <MissingText tooltipText="missing title" />}
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

const ArticleLanguageUI = ({
  language,
}: {
  language: Language | undefined;
}) => {
  return language ? (
    <span css={[tw`capitalize text-gray-600 text-sm`]}>{language.name}</span>
  ) : (
    <SubContentMissingFromStore subContentType="language" />
  );
};
