import { ReactElement } from "react";
import tw from "twin.macro";

export const Container = ({ children }: { children: ReactElement }) => (
  <div css={[tw`flex justify-center`]}>
    <div css={[tw`max-w-[65ch] w-full border-l border-r mx-lg`]}>
      {children}
    </div>
  </div>
);

export const EmptyContainer = tw.div`min-h-[300px] pl-lg pt-lg`;

export const EmptyContentContainer = tw.div``;

export const ItemContainer = tw.div`px-sm py-md border-b min-h-[250px]`;

export const ImageContainer = tw.div`w-[250px] aspect-ratio[16 / 9] float-left mr-sm`;

export const TextContainer = tw.div``;

export const Title = tw.h3`text-2xl font-serif-eng`;

export const SubTitleContainer = tw.div`text-xl font-serif-eng flex gap-xs mt-xxs flex-wrap`;

export const Authors = tw.div`flex items-center`;

export const Text = tw.div`text-base font-serif-eng mt-xs`;

export const menu = tw`absolute right-0 top-0`;

export const StatusContainer = tw.div`mb-sm flex justify-end text-sm`;
