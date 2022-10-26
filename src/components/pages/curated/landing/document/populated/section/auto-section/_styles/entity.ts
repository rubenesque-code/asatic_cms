import tw, { styled } from "twin.macro";
import { landingColorThemes } from "^data/landing";
import { LandingColorTheme } from "^types/landing";

export const $Title = styled.div(({ color }: { color: LandingColorTheme }) => [
  tw`text-3xl`,
  landingColorThemes[color].text,
]);

export const $authors = tw`text-2xl text-articleText mt-xxs`;
export const $Authors = tw.div`text-2xl text-articleText mt-xxxs`;

export const $Text = tw.div`text-articleText mt-xs`;

export const $status = tw`mb-sm flex text-sm`;

export const $imageContainer = tw`relative aspect-ratio[16 / 9] mb-xs`;
