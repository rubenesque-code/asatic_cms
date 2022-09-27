import { createContext, ReactElement, useContext, useState } from "react";
import tw from "twin.macro";
import ContainerUtility from "^components/ContainerUtilities";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import ArticleEditor from "^components/editors/tiptap/ArticleEditor";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import {
  checkObjectHasField,
  mapIds,
  sortComponents as sortComponents,
} from "^helpers/general";
import { Article as ArticleType } from "^types/article";
import AddBodySectionMenu from "./AddBodySectionMenu";
import ArticleUI from "./ArticleUI";
import ImageSection from "./ImageSection";
import VideoSection from "./VideoSection";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ArticleBody() {}

type ComponentContextValue = [
  { sectionHoveredIndex: number | null },
  { setSectionHoveredIndex: (index: number | null) => void }
];
const ComponentContext = createContext<ComponentContextValue>([
  {},
  {},
] as ComponentContextValue);

ArticleBody.Provider = function ArticleBodyProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<null | number>(
    null
  );

  return (
    <ComponentContext.Provider
      value={[{ sectionHoveredIndex }, { setSectionHoveredIndex }]}
    >
      {children}
    </ComponentContext.Provider>
  );
};

ArticleBody.useContext = function useArticleBodyContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context[1]);
  if (!contextIsPopulated) {
    throw new Error("useArticleBodyContext must be used within its provider!");
  }
  return context;
};

ArticleBody.Body = function ArticleBodyContent() {
  const [{ sectionHoveredIndex }] = ArticleBody.useContext();
  const [{ body }, { reorderBody }] = ArticleTranslationSlice.useContext();

  const bodySectionsSorted = sortComponents(body);
  const bodySectionsSortedIds = mapIds(bodySectionsSorted);

  return (
    <div css={[tw`mt-sm`]}>
      <AddBodySectionMenu menuIndex={0} show={sectionHoveredIndex === 0} />
      <div>
        <DndSortableContext
          elementIds={bodySectionsSortedIds}
          onReorder={reorderBody}
        >
          {bodySectionsSorted.map((section, i) => (
            <DndSortableElement
              elementId={section.id}
              handlePos="out"
              key={section.id}
            >
              <SectionContainer index={i}>
                <SectionContentTypeSwitch section={section} />
              </SectionContainer>
            </DndSortableElement>
          ))}
        </DndSortableContext>
      </div>
    </div>
  );
};

const SectionContainer = ({
  children: sectionContent,
  index,
}: {
  children: ReactElement;
  index: number;
}) => {
  const [{ sectionHoveredIndex }, { setSectionHoveredIndex }] =
    ArticleBody.useContext();

  const showAddSectionMenu =
    sectionHoveredIndex === index || sectionHoveredIndex === index + 1;

  return (
    <ContainerUtility.onHover
      onMouseEnter={() => setSectionHoveredIndex(index)}
      onMouseLeave={() => setSectionHoveredIndex(null)}
    >
      <>
        {sectionContent}
        <AddBodySectionMenu menuIndex={index + 1} show={showAddSectionMenu} />
      </>
    </ContainerUtility.onHover>
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

const TextSection = () => {
  const [{ text }, { updateBodyText }] = ArticleTextSectionSlice.useContext();

  return (
    <ArticleUI.TextSection>
      <ArticleEditor
        initialContent={text}
        onUpdate={(text) => updateBodyText({ text })}
        placeholder="Text"
      />
      <TextSectionMenu />
    </ArticleUI.TextSection>
  );
};

const TextSectionMenu = () => {
  const [, { removeBodySection }] = ArticleTranslationSlice.useContext();
  const [{ id: sectionId, index }] = ArticleTextSectionSlice.useContext();
  const [{ sectionHoveredIndex }] = ArticleBody.useContext();

  return (
    <ArticleUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    />
  );
};
