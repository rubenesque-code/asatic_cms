import { useComponentContext } from "../../Context";

import { $Container } from "^components/rich-popover/_styles/relatedEntities";
import Subject from "./subject";

const Populated = () => {
  const { parentEntityData } = useComponentContext();

  return (
    <$Container>
      {parentEntityData.subjectIds.map((subjectId) => (
        <Subject id={subjectId} key={subjectId} />
      ))}
    </$Container>
  );
};

export default Populated;
