import { ReactElement } from "react";
import { ArrowRight } from "phosphor-react";
import tw from "twin.macro";

import { landingColorThemes } from "^data/landing";

import { useLandingSectionContext } from "^context/landing/LandingSectionContext";

import { LandingColorTheme } from "^types/landing";
import { LandingSectionAuto } from "^types/landing";

import Section from "../Section";
import Articles from "./Articles";
import Blogs from "./Blogs";

export default function AutoSection() {
  const [section] = useLandingSectionContext();
  const { contentType } = section as LandingSectionAuto;

  return (
    <div css={[tw`relative`]}>
      {contentType === "article" ? (
        <Articles />
      ) : contentType === "blog" ? (
        <Blogs />
      ) : null}
      <Section.Menu />
    </div>
  );
}

AutoSection.Container = function GenericContainer({
  colorTheme,
  moreFromText,
  swiper,
  title,
}: {
  colorTheme: LandingColorTheme;
  title: string;
  moreFromText: string;
  swiper: ReactElement;
}) {
  return (
    <div css={[tw`font-serif-eng`, landingColorThemes[colorTheme].bg]}>
      <div
        css={[
          landingColorThemes[colorTheme].text,
          tw`flex items-center justify-between border-b`,
        ]}
      >
        <h3 css={[tw`pl-xl pt-sm pb-xs text-2xl`]}>{title}</h3>
        <p css={[tw`flex items-center gap-xs text-lg mr-lg`]}>
          <span>{moreFromText}</span>
          <ArrowRight weight="bold" />
        </p>
      </div>
      <div css={[tw`ml-lg z-10 border-l`]}>{swiper} </div>
    </div>
  );
};

AutoSection.Empty = function Empty({
  colorTheme,
  docType,
}: {
  colorTheme: LandingColorTheme;
  docType: string;
}) {
  return (
    <div
      css={[tw`font-sans text-center p-md`, landingColorThemes[colorTheme].bg]}
    >
      <h3
        css={[
          tw`capitalize text-lg text-center`,
          landingColorThemes[colorTheme].text,
        ]}
      >
        {docType} Auto Section
      </h3>
      <p css={[tw`mt-md`, landingColorThemes[colorTheme].text]}>
        No {docType} yet
      </p>
    </div>
  );
};
