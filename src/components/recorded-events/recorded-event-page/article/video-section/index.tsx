import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import Empty from "./Empty";
import Populated from "./Populated";

import { VideoSection as VideoSection_ } from "../styles";

export default function VideoSection() {
  const [{ youtubeId }] = RecordedEventSlice.useContext();

  return <VideoSection_>{youtubeId ? <Populated /> : <Empty />}</VideoSection_>;
}
