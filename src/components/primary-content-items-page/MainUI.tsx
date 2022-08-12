import { ReactElement } from "react";
import tw from "twin.macro";

const MainUI = ({
  createButton,
  filtersAndTable,
  title,
}: {
  createButton: ReactElement;
  filtersAndTable: ReactElement;
  title: string;
}) => (
  <main css={[s.main]}>
    <div css={[s.indentedContainer]}>
      <h1 css={[s.pageTitle]}>{title}</h1>
      <div>{createButton}</div>
    </div>
    {filtersAndTable}
  </main>
);

export default MainUI;

const s = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  indentedContainer: tw`ml-xl grid gap-lg`,
  pageTitle: tw`text-2xl font-medium`,
};
