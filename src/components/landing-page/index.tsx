import tw from "twin.macro";

import Canvas from "^components/display-entity/entity-page/Canvas";
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
          <Canvas maxWidth={tw`max-w-[1300px]`}>
            <Body />
          </Canvas>
        </>
      </SiteLanguage.Provider>
    </PageContainer>
  );
};

export default LandingPageContent;
