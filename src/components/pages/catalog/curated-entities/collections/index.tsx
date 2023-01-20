// import { ReactElement } from "react";

// import { useCreateCollectionMutation } from "^redux/services/collections";

// import { DeleteMutationProvider } from "./DeleteMutationContext";
// import { WriteMutationProvider } from "^context/WriteMutationContext";

import Header from "./Header";
import Body from "./body";
import { $PageContainer } from "../../_styles";

const PageContent = () => {
  return (
    <$PageContainer>
      {/* <MutationProviders> */}
      <>
        <Header />
        <Body />
      </>
      {/* </MutationProviders> */}
    </$PageContainer>
  );
};

export default PageContent;

/* const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  // const writeMutation = useCreateCollectionMutation();

  return (
    // <WriteMutationProvider mutation={writeMutation}>
    <DeleteMutationProvider>
      <>{children}</>
    </DeleteMutationProvider>
    // </WriteMutationProvider>
  );
};
 */
