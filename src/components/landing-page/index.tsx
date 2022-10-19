import tw from "twin.macro";

import Canvas_ from "^components/_containers/Canvas_";
import SiteLanguage from "^components/SiteLanguage";

import Header from "./Header";
import Body from "./body";
import { PageContainer } from "./styles";

const LandingPageContent = () => {
  return (
    <PageContainer>
      <SiteLanguage.Provider>
        <>
          <Header />
          <Canvas_ maxWidth={tw`max-w-[1300px]`}>
            <Body />
          </Canvas_>
        </>
      </SiteLanguage.Provider>
    </PageContainer>
  );
};

export default LandingPageContent;
