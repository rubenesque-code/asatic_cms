import { ReactElement } from "react";

import { DeleteMutationProvider } from "./DeleteMutationContext";
import { WriteMutationProvider } from "./WriteMutationContext";

import Header from "./Header";
import Body from "./body";
import { $PageContainer } from "../../_styles";

const AuthorsPageContent = () => {
  return (
    <$PageContainer>
      <MutationProviders>
        <>
          <Header />
          <Body />
        </>
      </MutationProviders>
    </$PageContainer>
  );
};

export default AuthorsPageContent;

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  return (
    <WriteMutationProvider>
      <DeleteMutationProvider>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};
