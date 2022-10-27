import DocsQuery from "^components/DocsQuery";
import { UsedTypeSelect, UsedTypeProvider } from "^components/UsedTypeSelect";
import { $BodySkeleton_, $Filters_ } from "../../../_presentation";
import UploadButton from "./UploadButton";
import UploadedImages from "./UploadedImages";

const Body = () => {
  return (
    <$BodySkeleton_ createButton={<UploadButton />} title="Images">
      <DocsQuery.Provider>
        <UsedTypeProvider>
          <>
            <$Filters_>
              <UsedTypeSelect />
              <DocsQuery.InputCard
                label="Keyword:"
                placeholder="image keyword..."
              />
            </$Filters_>
            <UploadedImages />
          </>
        </UsedTypeProvider>
      </DocsQuery.Provider>
    </$BodySkeleton_>
  );
};

export default Body;
