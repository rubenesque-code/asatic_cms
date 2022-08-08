import { ReactElement } from "react";
import tw from "twin.macro";

export const MainUI = ({
  children,
  title,
  explanatoryText,
}: {
  title: string;
  children: ReactElement;
  explanatoryText: string;
}) => (
  <main css={[s.main, tw`px-xl max-w-[1600px] m-auto`]}>
    <h1 css={[s.pageTitle]}>{title}</h1>
    <p css={[s.explanatoryText]}>{explanatoryText}</p>
    <div css={[tw`mt-lg`]}>{children}</div>
  </main>
);

const s = {
  main: tw`px-4 mt-2xl flex-grow`,
  pageTitle: tw`text-2xl font-medium`,
  explanatoryText: tw`text-gray-600 mt-xs text-sm`,
};
