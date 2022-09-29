import ArticleSlice from "^context/articles/ArticleContext";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import { sortComponents as sortComponents } from "^helpers/general";
import { Article as ArticleType } from "^types/article";

import Body from "^components/article-like/entity-page/article/Body";
import AddSectionMenuUnpopulated, {
  AddSectionButton,
} from "^components/article-like/entity-page/article/AddSectionMenu";

import ImageSection from "./ImageSection";
import TextSection from "./TextSection";
import VideoSection from "./VideoSection";
import AddSectionPopover from "./AddSectionPopover";

export default function ArticleBody() {
  const [{ body }] = ArticleTranslationSlice.useContext();

  const bodySectionsSorted = sortComponents(body);

  return (
    <Body
      addSectionMenu={({ isShowing, sectionToAddIndex }) => (
        <AddSectionMenu
          sectionToAddIndex={sectionToAddIndex}
          isShowing={isShowing}
        />
      )}
    >
      {bodySectionsSorted.map((section) => (
        <SectionContentTypeSwitch section={section} key={section.id} />
      ))}
    </Body>
  );
}

const AddSectionMenu = ({
  isShowing,
  sectionToAddIndex,
}: {
  isShowing: boolean;
  sectionToAddIndex: number;
}) => {
  return (
    <AddSectionMenuUnpopulated isShowing={isShowing}>
      <AddSectionPopover sectionToAddIndex={sectionToAddIndex}>
        <AddSectionButton />
      </AddSectionPopover>
    </AddSectionMenuUnpopulated>
  );
};

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
        <VideoSection />
      </ArticleVideoSectionSlice.Provider>
    );
  }

  throw new Error("invalid section type");
};
