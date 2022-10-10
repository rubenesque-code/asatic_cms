import LandingSectionSlice from "^context/landing/LandingSectionContext";

import { LandingSectionAuto } from "^types/landing";

import ContainerUtility from "^components/ContainerUtilities";

import Section from "../index";
import Articles from "./articles";
import Blogs from "./blogs";
import Collections from "./collections";
import RecordedEvents from "./recorded-events";

const AutoSection = () => {
  return (
    <ContainerUtility.isHovered>
      {(isHovered) => (
        <>
          <ContentTypeSwitch />
          <Section.Menu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export default AutoSection;

function ContentTypeSwitch() {
  const [section] = LandingSectionSlice.useContext();
  const { contentType } = section as LandingSectionAuto;

  return contentType === "article" ? (
    <Articles />
  ) : contentType === "blog" ? (
    <Blogs />
  ) : contentType === "recorded-event" ? (
    <RecordedEvents />
  ) : contentType === "collection" ? (
    <Collections />
  ) : null;
}
