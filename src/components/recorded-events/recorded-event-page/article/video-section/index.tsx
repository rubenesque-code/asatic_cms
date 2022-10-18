import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import Empty from "./Empty";
import Populated from "./Populated";

import { $VideoSection } from "../_styles";

export default function VideoSection() {
  const [{ youtubeId }] = RecordedEventSlice.useContext();

  return <$VideoSection>{youtubeId ? <Populated /> : <Empty />}</$VideoSection>;
}
