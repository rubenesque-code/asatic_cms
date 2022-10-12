import CollectionSlice from "^context/collections/CollectionContext";

import { Status_ } from "../../../_containers/Entity";

const Status = () => {
  const [{ publishDate, status }] = CollectionSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

export default Status;
