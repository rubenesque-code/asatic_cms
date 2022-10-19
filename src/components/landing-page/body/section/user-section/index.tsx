import tw from "twin.macro";

import LandingSectionSlice from "^context/landing/LandingSectionContext";
import LandingCustomSectionSlice from "^context/landing/LandingCustomSectionContext";

import { LandingSectionCustom } from "^types/landing";

import ContainerUtility from "^components/ContainerUtilities";
import Section from "../index";
import PrimaryEntityPopover from "./PrimaryEntityPopover";
import Populated from "./populated";
import Empty from "./Empty";
import ContentMenu from "^components/menus/Content";
import { Plus } from "phosphor-react";

const UserSection = () => {
  const [section] = LandingSectionSlice.useContext();
  const sectionAsserted = section as LandingSectionCustom;
  const { components } = sectionAsserted;

  return (
    <LandingCustomSectionSlice.Provider section={sectionAsserted}>
      <ContainerUtility.isHovered styles={tw`relative`}>
        {(isHovered) => (
          <>
            {components.length ? <Populated /> : <Empty />}
            <Menu isShowing={isHovered} />
          </>
        )}
      </ContainerUtility.isHovered>
    </LandingCustomSectionSlice.Provider>
  );
};

export default UserSection;

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  return (
    <Section.Menu
      isShowing={isShowing}
      extraButtons={
        <>
          <PrimaryEntityPopover>
            <ContentMenu.Button
              tooltipProps={{ text: "add component to section" }}
            >
              <Plus />
            </ContentMenu.Button>
          </PrimaryEntityPopover>
          <ContentMenu.VerticalBar />
        </>
      }
    />
  );
};
