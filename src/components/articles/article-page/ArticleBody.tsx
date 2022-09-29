import ArticleSlice from "^context/articles/ArticleContext";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import { sortComponents as sortComponents } from "^helpers/general";
import { Article as ArticleType } from "^types/article";

import Body from "^components/article-like/entity-page/article/Body";

import AddBodySectionMenu from "./AddBodySectionMenu";
import ImageSection from "./ImageSection";
import TextSection from "./TextSection";

export default function ArticleBody() {
  const [{ body }] = ArticleTranslationSlice.useContext();

  const bodySectionsSorted = sortComponents(body);

  return (
    <Body
      addSectionMenu={({ isShowing, sectionToAddIndex }) => (
        <AddBodySectionMenu menuIndex={sectionToAddIndex} show={isShowing} />
      )}
    >
      {bodySectionsSorted.map((section) => (
        <SectionContentTypeSwitch section={section} key={section.id} />
      ))}
    </Body>
  );
}

const SectionContentTypeSwitch = ({
  section,
}: {
  section: ArticleType["translations"][number]["body"][number];
}) => {
  const { type } = section;
  const [{ id: articleId }] = ArticleSlice.useContext();
  const [{ id: translationId }] = ArticleTranslationSlice.useContext();

  const ids = {
    articleId,
    translationId,
  };

  if (type === "image") {
    return (
      <ArticleImageSectionSlice.Provider {...ids} section={section}>
        <ImageSection />
      </ArticleImageSectionSlice.Provider>
    );
  }
  if (type === "text") {
    return (
      <ArticleTextSectionSlice.Provider {...ids} section={section}>
        <TextSection />
      </ArticleTextSectionSlice.Provider>
    );
  }
  if (type === "video") {
    return (
      <ArticleVideoSectionSlice.Provider {...ids} section={section}>
        {/* <VideoSection /> */}
        <div>Video</div>
      </ArticleVideoSectionSlice.Provider>
    );
  }

  throw new Error("invalid section type");
};
