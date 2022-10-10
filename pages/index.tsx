import type { NextPage } from "next";
import tw from "twin.macro";

import Head from "^components/Head";
import Header from "^components/header/Header";
import { DisplayPageLinks } from "^components/EntitiesLinksList";

const Home: NextPage = () => {
  return (
    <>
      <Head />
      <PageContent />
    </>
  );
};

export default Home;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <Header />
      <Body />
    </div>
  );
};

const Body = () => {
  return (
    <div css={[tw`flex-grow grid place-items-center`]}>
      <div>
        <h3 css={[tw`text-2xl font-medium`]}>Asatic Site Editor</h3>
        <div css={[tw`flex flex-col gap-sm mt-lg`]}>
          <DisplayPageLinks />
        </div>
      </div>
    </div>
  );
};
