import { PrimaryEntityStatus } from "^types/primary-entity";

import StatusLabel from "^components/StatusLabel";
import { $StatusContainer } from "../_styles";

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
    <$StatusContainer>
      <StatusLabel publishDate={publishDate} status={status} onlyShowUnready />
    </$StatusContainer>
  );
};

export default Status_;
