import { BodySkeleton_ } from "^catalog-pages/_containers/BodySkeleton_";

import CreateRecordedEventTypeForm from "./Form";
import RecordedEventTypesList from "./list";

const Body = () => {
  return (
    <BodySkeleton_
      createEntity={<CreateRecordedEventTypeForm />}
      entities={<RecordedEventTypesList />}
      title="Video Document Types"
    />
  );
};

export default Body;
