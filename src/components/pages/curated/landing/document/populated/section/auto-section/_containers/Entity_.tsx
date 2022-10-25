import { ReactElement } from "react";
import { JSONContent } from "@tiptap/core";
import dateformat from "dateformat";
import tw from "twin.macro";

import useTruncateTextEditorContent from "^hooks/useTruncateTextEditorContent";

import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import { GoToPageIcon } from "^components/Icons";
import {
  ToggleUseImageButton,
  ToggleUseImage,
} from "^components/display-entity/image/MenuButtons";
import ContainerUtility from "^components/ContainerUtilities";
import ContentMenu from "^components/menus/Content";
import { $Date, $Text } from "../_styles/entity";

export const Container_ = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => (
  <ContainerUtility.isHovered styles={tw`relative`}>
    {(isHovered) => children(isHovered)}
  </ContainerUtility.isHovered>
);

export const Date_ = ({ publishDate }: { publishDate: Date | undefined }) => {
  if (!publishDate) {
    return null;
  }

  const dateStr = dateformat(publishDate, "mmmm dS yyyy");

  return <$Date>{dateStr}</$Date>;
};

// todo: collection will use this?
export function Text_({
  numChars,
  text,
  updateEntityAutoSectionSummary,
}: {
  numChars: number;
  text: JSONContent | null | undefined;
  updateEntityAutoSectionSummary: (summary: JSONContent) => void;
}) {
  const { editorKey, truncated } = useTruncateTextEditorContent(text, numChars);

  return (
    <$Text>
      <SimpleTipTapEditor
        placeholder="Summary"
        initialContent={truncated || undefined}
        onUpdate={updateEntityAutoSectionSummary}
        key={editorKey}
      />
    </$Text>
  );
}

export function Menu_({
  isShowing,
  routeToEditPage,
  toggleUseImage,
}: {
  isShowing: boolean;
  routeToEditPage: () => void;
  toggleUseImage?: ToggleUseImage;
}) {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      {toggleUseImage ? (
        <>
          <ToggleUseImageButton {...toggleUseImage} />
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{ text: "go to edit page" }}
      >
        <GoToPageIcon />
      </ContentMenu.Button>
    </ContentMenu>
  );
}
