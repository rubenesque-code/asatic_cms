import { ReactElement } from "react";
import tw from "twin.macro";

export const $BodySkeleton_ = ({
  children: filtersAndTable,
  createButton: createEntityButton,
  title,
  isLoadingMutation,
}: {
  children: ReactElement;
  createButton: ReactElement;
  title: string;
  isLoadingMutation: boolean;
}) => (
  <div css={[tw`relative flex flex-grow h-full justify-center`]}>
    <main css={[s.main]}>
      <div css={[s.indentedContainer]}>
        <h1 css={[s.pageTitle]}>{title}</h1>
        <div css={[tw`flex`]}>{createEntityButton}</div>
      </div>
      {filtersAndTable}
    </main>
    {isLoadingMutation ? (
      <div css={tw`absolute inset-0 z-50 bg-gray-200 bg-opacity-30`} />
    ) : null}
  </div>
);

const s = {
  main: tw`px-4 mt-2xl flex flex-col flex-grow gap-lg max-w-[1200px] overflow-auto w-full`,
  indentedContainer: tw`ml-xl grid gap-lg`,
  pageTitle: tw`text-2xl font-medium`,
};
