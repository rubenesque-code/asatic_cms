import SiteLanguage from "^components/SiteLanguage";
import ContainersUI from "./ContainersUI";
import Header from "./Header";
import LandingPageBody from "./Body";

const LandingPageContent = () => {
  console.log("HELLO");

  return (
    <ContainersUI.Page>
      <SiteLanguage.Provider>
        <>
          <Header />
          <ContainersUI.Canvas>
            <LandingPageBody />
          </ContainersUI.Canvas>
        </>
      </SiteLanguage.Provider>
    </ContainersUI.Page>
  );
};

export default LandingPageContent;
