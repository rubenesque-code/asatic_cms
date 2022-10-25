import tw from "twin.macro";

import Canvas_ from "../_presentation/$Canvas_";
import SiteLanguage from "^components/SiteLanguage";

import Header from "./Header";
import Document from "./document";

const LandingPageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <SiteLanguage.Provider>
        <>
          <Header />
          <Canvas_ maxWidth={tw`max-w-[1300px]`}>
            <Document />
          </Canvas_>
        </>
      </SiteLanguage.Provider>
    </div>
  );
};

export default LandingPageContent;
