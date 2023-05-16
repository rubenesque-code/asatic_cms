import { $DocumentContainer } from "../../_styles/$page";
import Header from "./header";
import Body from "./body";

const Document = () => (
  <$DocumentContainer>
    <Header />
    <Body />
  </$DocumentContainer>
);

export default Document;
