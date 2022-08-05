import { Translate } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import LanguageMissingFromStore from "^components/LanguageError";
import MissingText from "^components/MissingText";
import { useSelector } from "^redux/hooks";
import { selectById as selectLanguageById } from "^redux/state/languages";
import { Article } from "^types/article";
import { Language } from "^types/language";

const ArticleAsListItem = ({ article }: { article: Article }) => {
  return (
    <div css={[tw`flex-grow flex items-center gap-sm flex-wrap`]}>
      {article.translations.map((translation, i) => (
        <Translation
          isFirst={i === 0}
          translation={translation}
          key={translation.id}
        />
      ))}
      <div css={[tw`flex items-center gap-xxs`]}>
        <div css={[tw`h-[16px] w-[0.5px] bg-gray-300`]} />
        <div css={[tw`h-[16px] w-[0.5px] bg-gray-300`]} />
      </div>
    </div>
  );
};

export default ArticleAsListItem;

const Translation = ({
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
    <TranslationUI
      isFirst={isFirst}
      language={<LanguageUI language={language} />}
      title={title}
    />
  );
};

const TranslationUI = ({
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

const LanguageUI = ({ language }: { language: Language | undefined }) => {
  return language ? (
    <span css={[tw`capitalize text-gray-600 text-sm`]}>{language.name}</span>
  ) : (
    <LanguageMissingFromStore />
  );
};
