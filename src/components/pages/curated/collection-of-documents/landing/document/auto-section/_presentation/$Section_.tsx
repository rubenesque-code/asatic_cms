import { ArrowRight } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

export function $Populated({
  moreFromText,
  swiper,
  title,
}: {
  title: string;
  moreFromText: string;
  swiper: ReactElement;
}) {
  return (
    <div css={[tw`font-serif-eng`]}>
      <div css={[tw`flex justify-between items-baseline border-b`]}>
        <h3 css={[tw`pl-xl pt-sm pb-xs text-2xl`]}>{title}</h3>
        <p css={[tw`flex items-center gap-xs text-lg mr-lg`]}>
          <span>{moreFromText}</span>
          <ArrowRight weight="bold" />
        </p>
      </div>
      <div css={[tw`ml-lg z-10 border-l border-b`]}>{swiper} </div>
    </div>
  );
}
