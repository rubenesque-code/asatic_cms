import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { Video_ } from "^components/pages/curated/_containers/Video_";

export default function Populated() {
  const [{ youtubeId }] = RecordedEventSlice.useContext();

  return <Video_ youtubeId={youtubeId!} />;
}
