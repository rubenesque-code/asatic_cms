import Header from "./Header";
import Body from "./body";
import { $PageContainer } from "../../_styles";

const AuthorsPageContent = () => {
  return (
    <$PageContainer>
      <>
        <Header />
        <Body />
      </>
    </$PageContainer>
  );
};

export default AuthorsPageContent;
