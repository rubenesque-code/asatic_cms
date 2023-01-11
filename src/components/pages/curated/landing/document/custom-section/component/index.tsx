import tw from "twin.macro";

import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import Article from "./article";
import Blog from "./blog";

const CustomSectionComponent = ({}: {}) => {
  const [{ entity }] = LandingCustomSectionComponentSlice.useContext();

  return (
    <div css={[tw`border p-xs`]}>
      {entity.type === "article" ? (
        <Article />
      ) : (
        // <Blog {...component} />
        <div>Blog</div>
      )}
    </div>
  );
};

export default CustomSectionComponent;
