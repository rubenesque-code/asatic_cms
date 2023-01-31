import tw from "twin.macro";

import { $CanvasDefault_ } from "../_presentation/$Canvas_";
import SiteLanguage from "^components/SiteLanguage";

import Header from "./Header";
import Document from "./Document";

const LandingPageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <SiteLanguage.Provider>
        <>
          <Header />
          <$CanvasDefault_ maxWidth={tw`max-w-[1300px]`}>
            <Document />
          </$CanvasDefault_>
        </>
      </SiteLanguage.Provider>
    </div>
  );
};

export default LandingPageContent;
