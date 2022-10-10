import tw, { styled } from "twin.macro";
import { landingColorThemes } from "^data/landing";
import { LandingColorTheme } from "^types/landing";

export const $Title = styled.h3(
  ({ color, isTitle }: { color: LandingColorTheme; isTitle: boolean }) => [
    tw`text-3xl`,
    isTitle ? landingColorThemes[color].text : tw`text-gray-placeholder`,
  ]
);

export const $Authors = tw.div`text-2xl text-articleText mt-xxxs`;

export const $Text = tw.div`text-articleText mt-xs`;
