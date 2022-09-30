import { Plus } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import TextArea from "^components/editors/TextArea";

import { Caption } from "../styles/article";
import {
  AddContentButton,
  AddContentIcon,
  AddContentText,
  Container,
  Title,
} from "../styles/sectionEmpty";

export default function MediaSection({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
}

MediaSection.Caption = function Caption_({
  caption,
  updateCaption,
}: {
  caption: string | undefined;
  updateCaption: (caption: string) => void;
}) {
  return (
    <Caption>
      <TextArea
        injectedValue={caption}
        onBlur={updateCaption}
        placeholder="optional caption"
      />
    </Caption>
  );
};

function MediaSectionEmpty({
  children,
  title,
}: {
  children: (isHovered: boolean) => ReactElement;
  title: string;
}) {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => (
        <Container>
          <Title>{title}</Title>
          {children(isHovered)}
        </Container>
      )}
    </ContainerUtility.isHovered>
  );
}

MediaSection.Empty = MediaSectionEmpty;

MediaSectionEmpty.AddContentButton = function AddContentButton_({
  children,
  text,
}: {
  children: ReactElement;
  text: string;
}) {
  return (
    <AddContentButton>
      <AddContentIcon>
        <span>{children}</span>
        <span>
          <Plus />
        </span>
      </AddContentIcon>
      <AddContentText>{text}</AddContentText>
    </AddContentButton>
  );
};
