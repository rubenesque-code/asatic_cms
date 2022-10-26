import { ReactElement } from "react";
import tw from "twin.macro";

export const $BodySkeleton_ = ({
  children: filtersAndTable,
  createButton: createEntityButton,
  title,
}: {
  children: ReactElement;
  createButton: ReactElement;
  title: string;
}) => (
  <main css={[s.main]}>
    <div css={[s.indentedContainer]}>
      <h1 css={[s.pageTitle]}>{title}</h1>
      <div>{createEntityButton}</div>
    </div>
    {filtersAndTable}
  </main>
);

const s = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  indentedContainer: tw`ml-xl grid gap-lg`,
  pageTitle: tw`text-2xl font-medium`,
};
