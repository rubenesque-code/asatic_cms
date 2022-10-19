import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import { $UserComponentContainer } from "../../_styles";

import Article from "./article";
import Blog from "./blog";
import RecordedEvent from "./recorded-event";

const Component = () => {
  const [{ type }] = LandingCustomSectionComponentSlice.useContext();

  return (
    <$UserComponentContainer>
      {type === "article" ? (
        <Article />
      ) : type === "blog" ? (
        <Blog />
      ) : (
        <RecordedEvent />
      )}
    </$UserComponentContainer>
  );
};

export default Component;
