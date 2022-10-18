// import { Plus } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import TextArea from "^components/editors/TextArea";

import { Caption } from "../_styles/article";
import {
  AddContentButton,
  AddContentIcon,
  AddContentText,
  Container,
  Title,
} from "../_styles/sectionEmpty";

export default function MediaSection({
  children,
}: {
  children: ReactElement | ((isHovered: boolean) => ReactElement);
}) {
  return typeof children === "function" ? (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  ) : (
    <div css={[tw`relative`]}>{children}</div>
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
  children: ReactElement | ((isHovered: boolean) => ReactElement);
  title: string;
}) {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => (
        <Container>
          <Title>{title}</Title>
          {typeof children === "function" ? children(isHovered) : children}
        </Container>
      )}
    </ContainerUtility.isHovered>
  );
}

MediaSection.Empty = MediaSectionEmpty;

MediaSectionEmpty.AddContentButton = function AddContentButton_({
  children,
  text,
}: // plusIconColor = tw`bg-white`,
{
  children: ReactElement;
  text: string;
  // plusIconColor?: TwStyle;
}) {
  return (
    <AddContentButton>
      <AddContentIcon>
        <span>{children}</span>
        {/*         <span css={[plusIconColor]}>
          <Plus />
        </span> */}
      </AddContentIcon>
      <AddContentText>{text}</AddContentText>
    </AddContentButton>
  );
};
