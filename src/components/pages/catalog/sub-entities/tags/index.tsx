import Header from "./Header";
import Body from "./body";
import { $PageContainer } from "../../_styles";

const TagsPageContent = () => {
  return (
    <$PageContainer>
      <>
        <Header />
        <Body />
      </>
    </$PageContainer>
  );
};

export default TagsPageContent;
