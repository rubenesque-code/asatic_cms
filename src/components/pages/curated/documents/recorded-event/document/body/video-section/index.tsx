import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { $MediaSectionContainer_ } from "^components/pages/curated/_presentation/$MediaSection_";
import Empty from "./Empty";
import Populated from "./Populated";

import { $VideoSection } from "../../_styles";
import Menu from "./Menu";

export default function VideoSection() {
  const [{ youtubeId }] = RecordedEventSlice.useContext();

  return (
    <$MediaSectionContainer_
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
    >
      <$VideoSection>{youtubeId ? <Populated /> : <Empty />}</$VideoSection>
    </$MediaSectionContainer_>
  );
}
