import { createContext, ReactElement, useContext, useState } from "react";
import ContainerUtility from "^components/ContainerUtilities";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import ArticleEditor from "^components/editors/tiptap/ArticleEditor";
import BlogSlice from "^context/blogs/BlogContext";

import {
  checkObjectHasField,
  mapIds,
  sortComponents as sortComponents,
} from "^helpers/general";
import AddBodySectionMenu from "./AddBodySectionMenu";
import BlogUI from "./BlogUI";
import ImageSection from "./ImageSection";
import VideoSection from "./VideoSection";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import { BlogTranslation } from "^types/blog";
import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";
import BlogTextSectionSlice from "^context/blogs/BlogTextSectionContext";
import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Body() {}

type ComponentContextValue = [
  { sectionHoveredIndex: number | null },
  { setSectionHoveredIndex: (index: number | null) => void }
];
const ComponentContext = createContext<ComponentContextValue>([
  {},
  {},
] as ComponentContextValue);

Body.Provider = function BodyProvider({
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

Body.useContext = function useBlogBodyContext() {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context[1]);
  if (!contextIsPopulated) {
    throw new Error("useBlogBodyContext must be used within its provider!");
  }
  return context;
};

Body.Body = function BodyContent() {
  const [{ sectionHoveredIndex }] = Body.useContext();
  const [{ body }, { reorderBody }] = BlogTranslationSlice.useContext();

  const bodySectionsSorted = sortComponents(body);
  const bodySectionsSortedIds = mapIds(bodySectionsSorted);

  return (
    <>
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
    </>
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
    Body.useContext();

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
  section: BlogTranslation["body"][number];
}) => {
  const { type } = section;
  const [{ id: blogId }] = BlogSlice.useContext();
  const [{ id: translationId }] = BlogTranslationSlice.useContext();

  const ids = {
    blogId,
    translationId,
  };

  if (type === "image") {
    return (
      <BlogImageSectionSlice.Provider {...ids} section={section}>
        <ImageSection />
      </BlogImageSectionSlice.Provider>
    );
  }
  if (type === "text") {
    return (
      <BlogTextSectionSlice.Provider {...ids} section={section}>
        <TextSection />
      </BlogTextSectionSlice.Provider>
    );
  }
  if (type === "video") {
    return (
      <BlogVideoSectionSlice.Provider {...ids} section={section}>
        <VideoSection />
      </BlogVideoSectionSlice.Provider>
    );
  }

  throw new Error("invalid section type");
};

const TextSection = () => {
  const [{ text }, { updateBodyText }] = BlogTextSectionSlice.useContext();

  return (
    <BlogUI.TextSection>
      <ArticleEditor
        initialContent={text}
        onUpdate={(text) => updateBodyText({ text })}
        placeholder="Text"
      />
      <TextSectionMenu />
    </BlogUI.TextSection>
  );
};

const TextSectionMenu = () => {
  const [, { removeBodySection }] = BlogTranslationSlice.useContext();
  const [{ id: sectionId, index }] = BlogTextSectionSlice.useContext();
  const [{ sectionHoveredIndex }] = Body.useContext();

  return (
    <BlogUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    />
  );
};
