import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { useSelector } from "^redux/hooks";
import { selectTagById } from "^redux/state/tags";

const HandleDocTag = ({ tagId }: { tagId: string }) => {
  const tag = useSelector((state) => selectTagById(state, tagId));

  return (
    <>{tag ? tag.text : <SubContentMissingFromStore subContentType="tag" />}</>
  );
};

export default HandleDocTag;
