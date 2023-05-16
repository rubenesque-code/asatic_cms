import DocsQuery from "^components/DocsQuery";
import { useUsedTypeContext } from "^components/UsedTypeSelect";
import UploadedImages_ from "^components/images/Uploaded";

const UploadedImages = () => {
  const query = DocsQuery.useContext();
  const { value: usedTypeValue } = useUsedTypeContext();

  return <UploadedImages_ keywordQuery={query} usedType={usedTypeValue} />;
};

export default UploadedImages;
