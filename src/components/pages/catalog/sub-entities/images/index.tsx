import Header from "./Header";
import Body from "./body";
import { $PageContainer } from "../../_styles";

const PageContent = () => {
  return (
    <$PageContainer>
      <Header />
      <Body />
    </$PageContainer>
  );
};

export default PageContent;
