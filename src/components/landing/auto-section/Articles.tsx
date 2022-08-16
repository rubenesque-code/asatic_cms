import tw from "twin.macro";
import DivHover from "^components/ContainerHover";
import MissingText from "^components/MissingText";
import SiteLanguage from "^components/SiteLanguage";
import {
  ArticleProvider,
  useArticleContext,
} from "^context/articles/ArticleContext";
import {
  ArticleTranslationProvider,
  useArticleTranslationContext,
} from "^context/articles/ArticleTranslationContext";
import { landingColorThemes } from "^data/landing";
import { selectTranslationForSiteLanguage } from "^helpers/article";
import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/articles";
import { LandingColorTheme } from "^types/landing";
import AutoSection from "./AutoSection";
import Swiper from "./Swiper";

export default function Articles() {
  return (
    <AutoSection.Container
      colorTheme="cream"
      swiper={<ArticlesSwiper />}
      title="Articles"
      moreFromText="More from articles"
    />
  );
}

const ArticlesSwiper = () => {
  const articles = useSelector(selectAll);
  // reorder articles

  return (
    <Swiper
      colorTheme="cream"
      elements={articles.map((article) => (
        <ArticleProvider article={article} key={article.id}>
          <Article />
        </ArticleProvider>
      ))}
    />
  );
};

function Article() {
  const [
    {
      id: articleId,
      translations,
      landing: { useImage, imageId },
    },
  ] = useArticleContext();
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForSiteLanguage(
    translations,
    siteLanguageId
  );

  return (
    <ArticleTranslationProvider translation={translation} articleId={articleId}>
      <DivHover styles={tw`border-r h-full`}>
        {(isHovered) => (
          <>
            <ArticleContent />
            {/* <AutoSectionArticleMenu containerIsHovered={isHovered} /> */}
          </>
        )}
      </DivHover>
    </ArticleTranslationProvider>
  );
}

function ArticleContent() {
  const [{ title }] = useArticleTranslationContext();

  return (
    <Swiper.Element>
      <>
        <ArticleTitle colorTheme="cream" title={title} />;
      </>
    </Swiper.Element>
  );
}

function ArticleTitle({
  colorTheme,
  title,
}: {
  colorTheme: LandingColorTheme;
  title: string | undefined;
}) {
  return (
    <h3 css={[tw`text-3xl`, landingColorThemes[colorTheme].text]}>
      {title ? (
        title
      ) : (
        <div css={[tw`flex items-center gap-sm`]}>
          <span css={[tw`text-gray-placeholder`]}>title...</span>
          <MissingText tooltipText="missing title for language" />
        </div>
      )}
    </h3>
  );
}
