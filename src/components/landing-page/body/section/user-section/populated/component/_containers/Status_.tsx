import { PrimaryEntityStatus } from "^types/primary-entity";

import StatusLabel from "^components/StatusLabel";
import { $Status } from "../_styles";

const Status_ = ({
  publishDate,
  status,
}: {
  publishDate: Date | undefined;
  status: PrimaryEntityStatus;
}) => {
  if (status === "good") {
    return null;
  }
  return (
    <$Status>
      <StatusLabel publishDate={publishDate} status={status} onlyShowUnready />
    </$Status>
  );
};

export default Status_;
