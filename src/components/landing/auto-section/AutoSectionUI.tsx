import { ArrowRight, FileText } from "phosphor-react";
import { ComponentProps, ReactElement } from "react";
import tw from "twin.macro";
import Image from "^components/images/Image";
import ContentMenu from "^components/menus/Content";
import { landingColorThemes } from "^data/landing";
import { LandingColorTheme } from "^types/landing";
import { MyOmit } from "^types/utilities";

export default function AutoSectionUI({
  colorTheme,
  moreFromText,
  swiper,
  title,
}: {
  colorTheme: LandingColorTheme;
  title: string;
  moreFromText?: string;
  swiper: ReactElement;
}) {
  return (
    <div css={[tw`font-serif-eng border-b`, landingColorThemes[colorTheme].bg]}>
      <div
        css={[
          landingColorThemes[colorTheme].text,
          tw`flex items-center justify-between border-b`,
        ]}
      >
        <h3 css={[tw`pl-xl pt-sm pb-xs text-2xl`]}>{title}</h3>
        {moreFromText ? (
          <p css={[tw`flex items-center gap-xs text-lg mr-lg`]}>
            <span>{moreFromText}</span>
            <ArrowRight weight="bold" />
          </p>
        ) : null}
      </div>
      <div css={[tw`ml-lg z-10 border-l`]}>{swiper} </div>
    </div>
  );
}

AutoSectionUI.Empty = function Empty({
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

AutoSectionUI.ItemContainer = tw.div`py-sm px-xs h-full flex flex-col`;

AutoSectionUI.ItemMenu = function Menu({
  children,
  routeToEditPage,
  show,
}: {
  children?: ReactElement;
  routeToEditPage: () => void;
  show: boolean;
}) {
  return (
    <ContentMenu show={show} styles={tw`absolute top-0 right-0`}>
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{ text: "go to edit page" }}
      >
        <FileText />
      </ContentMenu.Button>
      {children ? children : null}
    </ContentMenu>
  );
};

type ImageMenuProps = MyOmit<
  ComponentProps<typeof Image.Menu>,
  "additionalButtons"
>;

AutoSectionUI.ItemImageMenu = function ImageMenu(props: ImageMenuProps) {
  return <Image.Menu containerStyles={tw`absolute top-0 left-0`} {...props} />;
};
