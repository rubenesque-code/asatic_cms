import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import { $UserComponentContainer } from "../../_styles";

import Article from "./article";
import Blog from "./blog";
import RecordedEvent from "./recorded-event";

const Component = () => {
  const [{ entity }] = LandingCustomSectionComponentSlice.useContext();

  return (
    <$UserComponentContainer>
      {entity.type === "article" ? (
        <Article />
      ) : entity.type === "blog" ? (
        <Blog />
      ) : (
        <RecordedEvent />
      )}
    </$UserComponentContainer>
  );
};

export default Component;
