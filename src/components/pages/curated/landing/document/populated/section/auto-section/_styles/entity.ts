import tw, { styled } from "twin.macro";
import { landingColorThemes } from "^data/landing";
import { LandingColorTheme } from "^types/landing";

export const $Title = styled.div(({ color }: { color: LandingColorTheme }) => [
  tw`text-3xl`,
  landingColorThemes[color].text,
]);

export const $authors = tw`text-2xl text-articleText mt-xxxs`;
export const $Authors = tw.div`text-2xl text-articleText mt-xxxs`;

export const $Date = tw.div`uppercase text-base tracking-wide font-light font-sans`;

export const $Text = tw.div`text-articleText mt-xs`;

export const $status = tw`mb-sm flex text-sm`;
export const $Status = tw.div`mb-sm flex text-sm`;

export const $imageContainer = tw`relative aspect-ratio[16 / 9] mb-xs`;
export const $ImageContainer = tw.div`aspect-ratio[16 / 9] mb-xs`;
