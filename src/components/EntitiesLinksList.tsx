import Link from "next/link";
import { ReactElement } from "react";
import tw from "twin.macro";

import { ExtractRouteKey, Routes } from "^constants/routes";

import {
  ArticleIcon,
  BlogIcon,
  CollectionIcon,
  ImageIcon,
  LandingIcon,
  RecordedEventIcon,
} from "./Icons";

type PageRouteKeys = ExtractRouteKey<
  "LANDING" | "ARTICLES" | "BLOGS" | "COLLECTIONS" | "RECORDEDEVENTS" | "IMAGES"
>;

type PageLink = Routes[PageRouteKeys] & { icon: ReactElement };

export const displayPageLinks: PageLink[] = [
  { label: "landing", route: "/landing", icon: <LandingIcon /> },
  { label: "articles", route: "/articles", icon: <ArticleIcon /> },
  { label: "blogs", route: "/blogs", icon: <BlogIcon /> },
  { label: "collections", route: "/collections", icon: <CollectionIcon /> },
  {
    label: "recorded events",
    route: "/recorded-events",
    icon: <RecordedEventIcon />,
  },
];

export const DisplayPageLinks = () => {
  return (
    <>
      {displayPageLinks.map((item) => (
        <PageLink {...item} key={item.label} />
      ))}
    </>
  );
};

export const secondaryPageLinks: PageLink[] = [
  { label: "images", route: "/images", icon: <ImageIcon /> },
];

export const SecondaryPageLinks = () => {
  return (
    <>
      {secondaryPageLinks.map((item) => (
        <PageLink {...item} key={item.label} />
      ))}
    </>
  );
};

export const PageLink = ({
  icon,
  route,
  label,
  children,
}: {
  children?: ReactElement;
} & PageLink) => {
  return (
    <Link href={route} passHref>
      <a css={[s_pageLink.item]} className="group">
        <span css={[s_pageLink.icon]}>{icon}</span>
        <span css={[s_pageLink.text]}>{label}</span>
        {children ? children : null}
      </a>
    </Link>
  );
};

export const s_pageLink = {
  item: tw`flex gap-sm items-center cursor-pointer capitalize text-gray-600`,
  text: tw`hover:text-gray-800 transition-colors ease-in-out duration-75`,
  icon: tw`text-2xl text-gray-400`,
  linkArrowIcon: tw`text-xl translate-x-0 group-hover:translate-x-1 group-hover:opacity-100 opacity-0 text-blue-500 transition-all duration-75 ease-in-out`,
};
