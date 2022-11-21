import CollectionSlice from "^context/collections/CollectionContext";

import { Status_ } from "^components/pages/curated/_containers/entity-summary";
import { $status } from "../../../_styles/entity";

const Status = () => {
  const [{ status, publishDate }] = CollectionSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} styles={$status} />;
};

export default Status;
