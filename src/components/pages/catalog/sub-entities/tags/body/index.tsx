import { BodySkeleton_ } from "^catalog-pages/_containers/BodySkeleton_";

import CreateTagForm from "./CreateTagForm";
import TagList from "./TagList";

const Body = () => (
  <BodySkeleton_
    createEntity={<CreateTagForm />}
    entities={<TagList />}
    isTranslatable={false}
    title="Tags"
  />
);

export default Body;
