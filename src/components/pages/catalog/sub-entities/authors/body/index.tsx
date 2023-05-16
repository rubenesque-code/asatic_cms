import { BodySkeleton_ } from "^catalog-pages/_containers/BodySkeleton_";

import CreateAuthorForm from "./CreateAuthorForm";
import AuthorList from "./author-list";

const Body = () => {
  return (
    <BodySkeleton_
      createEntity={<CreateAuthorForm />}
      entities={<AuthorList />}
      title="Authors"
    />
  );
};

export default Body;
