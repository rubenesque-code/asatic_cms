import { $DocumentContainer } from "^components/pages/curated/document/_styles/$articleLikeDocument";
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
