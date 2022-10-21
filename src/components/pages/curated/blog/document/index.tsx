import { $DocumentContainer } from "../../_styles/$ArticleLike";
import Header from "./Header";
import Body from "./body";

const Document = () => {
  return (
    <$DocumentContainer>
      <Header />
      <Body />
    </$DocumentContainer>
  );
};

export default Document;
