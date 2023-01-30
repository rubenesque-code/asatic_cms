import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";
import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";
import ArticleTableSectionSlice from "^context/articles/ArticleTableSectionContext";

import { Article as ArticleType } from "^types/article";

import { $DocumentBodyPopulated_ } from "^components/pages/curated/document/_presentation/article-like";
import AddSectionPopover from "../AddSectionPopover";
import ImageSection from "./image-section";
import TextSection from "./TextSection";
import VideoSection from "./video-section";
import TableSection from "./table-section";

const Populated = () => {
  const [{ body }] = ArticleTranslationSlice.useContext();

  return (
    <$DocumentBodyPopulated_
      addSectionPopover={(button, sectionToAddIndex) => (
        <AddSectionPopover sectionToAddIndex={sectionToAddIndex}>
          {button}
        </AddSectionPopover>
      )}
    >
      {body.map((section) => (
        <SectionTypeSwitch section={section} key={section.id} />
      ))}
    </$DocumentBodyPopulated_>
  );
};

export default Populated;

const SectionTypeSwitch = ({
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

  if (type === "table") {
    return (
      <ArticleTableSectionSlice.Provider {...ids} section={section}>
        <TableSection />
      </ArticleTableSectionSlice.Provider>
    );
  }

  return (
    <ArticleVideoSectionSlice.Provider {...ids} section={section}>
      <VideoSection />
    </ArticleVideoSectionSlice.Provider>
  );
};
