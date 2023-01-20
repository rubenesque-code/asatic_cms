import Table from "./Table";
import { BodySkeleton_ } from "../../../_containers";
import CreateCollectionPopover from "../CreateCollectionPopover";

const Body = () => (
  <BodySkeleton_
    createEntity={<CreateCollectionPopover />}
    entities={<Table />}
    title="Collections"
    description="Collections are used to group content in a narrower way than a subject, or any way you see fit. E.g. &quot;Environment&quot; (collection) vs 'Politics' (subject). They can be displayed on the landing page."
  />
);

export default Body;
