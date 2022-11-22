import LandingSectionSlice from "^context/landing/LandingSectionContext";

import { AutoSection as AutoSectionType } from "^types/landing";

import ContainerUtility from "^components/ContainerUtilities";

import Articles from "./articles";
import Blogs from "./blogs";
import Collections from "./collections";
import RecordedEvents from "./recorded-events";
import { Menu_ } from "../_containers/Menu_";

const AutoSection = () => {
  return (
    <ContainerUtility.isHovered>
      {(isHovered) => (
        <>
          <ContentTypeSwitch />
          <Menu_ isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export default AutoSection;

function ContentTypeSwitch() {
  const [section] = LandingSectionSlice.useContext();
  const { contentType } = section as AutoSectionType;

  return contentType === "article" ? (
    <Articles />
  ) : contentType === "blog" ? (
    <Blogs />
  ) : contentType === "recordedEvent" ? (
    <RecordedEvents />
  ) : contentType === "collection" ? (
    <Collections />
  ) : null;
}
