import { ReactElement } from "react";
import tw from "twin.macro";

export const $BodySkeleton_ = ({
  children: filtersAndList,
  createEntity,
  title,
  isLoadingMutation,
}: {
  children: ReactElement;
  createEntity: ReactElement;
  title: string;
  isLoadingMutation?: boolean;
}) => (
  <div css={[tw`relative flex flex-grow h-full justify-center`]}>
    <main css={[s.main]}>
      <div css={[s.indentedContainer]}>
        <h1 css={[s.pageTitle]}>{title}</h1>
        <div css={[tw`flex`]}>{createEntity}</div>
      </div>
      {filtersAndList}
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
