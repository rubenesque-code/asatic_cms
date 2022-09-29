import { createContext, ReactElement, useContext, useState } from "react";
import tw from "twin.macro";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import {
  checkObjectHasField,
  sortComponents as sortComponents,
} from "^helpers/general";
import { Article as ArticleType } from "^types/article";

import ContainerUtility from "^components/ContainerUtilities";
import ArticleEditor from "^components/editors/tiptap/ArticleEditor";

import AddBodySectionMenu from "./AddBodySectionMenu";
import ArticleUI from "./ArticleUI";
import ImageSection from "./ImageSection";
import VideoSection from "./VideoSection";
import ContentMenu from "^components/menus/Content";
import { ArrowDown, ArrowUp, Trash } from "phosphor-react";

import Body from "^components/article-like/entity-page/article/Body";
import TextSectionUnpopulated from "^components/article-like/entity-page/article/TextSection";
import SectionMenuGeneric from "./SectionMenuGeneric";
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

export const SectionMenu = ({
  children: extraButtons,
  isShowing,
  sectionId,
  sectionIndex,
}: {
  children?: ReactElement;
  isShowing: boolean;
  sectionId: string;
  sectionIndex: number;
}) => {
  const [{ body }, { moveSection, removeBodySection }] =
    ArticleTranslationSlice.useContext();

  const canMoveDown = sectionIndex < body.length - 1;
  const canMoveUp = sectionIndex > 0;

  return (
    <ContentMenu styles={tw`top-0 right-0`} show={isShowing}>
      <>
        {extraButtons}
        <ContentMenu.Button
          isDisabled={!canMoveDown}
          onClick={() => moveSection({ direction: "down", sectionId })}
          tooltipProps={{ text: "move section down", type: "action" }}
        >
          <ArrowDown />
        </ContentMenu.Button>
        <ContentMenu.Button
          isDisabled={!canMoveUp}
          onClick={() => moveSection({ direction: "up", sectionId })}
          tooltipProps={{ text: "move section up", type: "action" }}
        >
          <ArrowUp />
        </ContentMenu.Button>
        <ContentMenu.ButtonWithWarning
          warningProps={{
            callbackToConfirm: () => removeBodySection({ sectionId }),
            warningText: "delete section?",
            type: "moderate",
          }}
          tooltipProps={{ text: "delete section", type: "action" }}
        >
          <Trash />
        </ContentMenu.ButtonWithWarning>
      </>
    </ContentMenu>
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
