import tw from "twin.macro";

import LandingSectionSlice from "^context/landing/LandingSectionContext";
import LandingCustomSectionSlice from "^context/landing/LandingCustomSectionContext";

import { LandingSectionCustom } from "^types/landing";

import ContainerUtility from "^components/ContainerUtilities";
import Populated from "./populated";
import Empty from "./Empty";
import Menu from "./Menu";

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
