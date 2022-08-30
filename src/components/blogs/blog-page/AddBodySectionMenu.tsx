import { PlusCircle } from "phosphor-react";
import tw from "twin.macro";

import ContentMenu from "^components/menus/Content";
import s_transition from "^styles/transition";
import WithAddSection from "./WithAddSection";

const AddBodySectionMenu = ({
  menuIndex,
  show,
}: {
  show: boolean;
  menuIndex: number;
}) => {
  return (
    <div
      css={[
        tw`relative z-30 hover:z-50 h-[20px]`,
        s_transition.toggleVisiblity(show),
        tw`opacity-30 hover:opacity-100 hover:visible`,
      ]}
    >
      <ButtonsContainer>
        <AddSectionButton menuIndex={menuIndex} />
      </ButtonsContainer>
    </div>
  );
};

export default AddBodySectionMenu;

const ButtonsContainer = tw.div`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`;

const AddSectionButton = ({ menuIndex }: { menuIndex: number }) => {
  return (
    <WithAddSection sectionToAddIndex={menuIndex}>
      <ContentMenu.Button
        tooltipProps={{ text: "add a text, image or video section" }}
      >
        <PlusCircle />
      </ContentMenu.Button>
    </WithAddSection>
  );
};
