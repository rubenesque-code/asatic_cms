import tw from "twin.macro";

export const Container = tw.div`relative font-sans h-[150px] grid place-items-center border border-gray-200`;

export const Title = tw.h4`text-gray-300 absolute left-1 top-0.5 uppercase text-xs`;

export const AddContentButton = tw.div`
  flex items-center gap-xs cursor-pointer
`;

export const AddContentIcon = tw.div`
  relative text-gray-300

  [>span:nth-of-type(1)]:(text-3xl)
  [>span:nth-of-type(2)]:(absolute -bottom-0.5 -right-1 bg-white)
`;
export const AddContentText = tw.p`text-gray-600`;
