import StatusLabel from "^components/StatusLabel";
import { PrimaryEntityStatus } from "^types/primary-entity";
import { StatusContainer } from "../styles";

const Status = ({
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
    <StatusContainer>
      <StatusLabel publishDate={publishDate} status={status} onlyShowUnready />
    </StatusContainer>
  );
};

export default Status;
