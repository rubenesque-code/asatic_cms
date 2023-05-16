import Table from "./Table";
import { BodySkeleton_ } from "../../../_containers";
import CreateSubjectPopover from "./CreateSubjectPopover";

// todo: is same for each curated entity apart from  table, title and entity type on create button
const Body = () => (
  <BodySkeleton_
    createEntity={<CreateSubjectPopover />}
    entities={<Table />}
    title="Subjects"
    description="Subjects are a broad categorisation. E.g. politics, biology, art."
  />
);

export default Body;
