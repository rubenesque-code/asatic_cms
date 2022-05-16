import type { NextPage } from "next";
import tw from "twin.macro";

import Head from "^components/Head";

const Home: NextPage = () => {
  return (
    <div>
      <Head />
      <div className="bg-red-400">Hello</div>
      <div css={tw`inline-block bg-blue-300`}>Inline</div>
    </div>
  );
};

export default Home;
