import tw from "twin.macro";

import SiteLanguage from "^components/SiteLanguage";

import Header from "./Header";
import Document from "./Document";
import StickyCanvas_ from "../document/_containers/StickyCanvas_";

const AboutPageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <SiteLanguage.Provider>
        <>
          <Header />
          <StickyCanvas_>
            <Document />
          </StickyCanvas_>
        </>
      </SiteLanguage.Provider>
    </div>
  );
};

export default AboutPageContent;
