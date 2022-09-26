import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement } from "react";
import {
  ArrowRight,
  Article as ArticleIcon,
  CirclesFour as CirclesFourIcon,
  Notepad as NotepadIcon,
  SquaresFour as SquaresFourIcon,
  VideoCamera as VideoCameraIcon,
} from "phosphor-react";
import tw from "twin.macro";

import { ROUTES } from "^constants/routes";

import Head from "^components/Head";
import Header from "^components/header/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head />
      <PageContent />
    </>
  );
};

export default Home;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <Header />
      <Body />
    </div>
  );
};

const Body = () => {
  return (
    <div css={[tw`flex-grow grid place-items-center`]}>
      <div>
        <h3 css={[tw`text-2xl font-medium`]}>Asatic Site Editor</h3>
        <div css={[tw`flex flex-col gap-sm mt-lg`]}>
          {contentRouteData.map((routeData) => (
            <PageLink
              icon={routeData.icon}
              route={routeData.route}
              key={routeData.label}
            >
              {routeData.label}
            </PageLink>
          ))}
        </div>
      </div>
    </div>
  );
};

const contentRouteData = [
  { label: "landing", route: ROUTES.LANDING, icon: <SquaresFourIcon /> },
  { label: "articles", route: ROUTES.ARTICLES, icon: <ArticleIcon /> },
  { label: "blogs", route: ROUTES.BLOGS, icon: <NotepadIcon /> },
  {
    label: "collections",
    route: ROUTES.COLLECTIONS,
    icon: <CirclesFourIcon />,
  },
  {
    label: "recorded events",
    route: ROUTES.RECORDEDEVENTS,
    icon: <VideoCameraIcon />,
  },
];

const PageLink = ({
  icon,
  route,
  children,
}: {
  children: string;
  route: string;
  icon: ReactElement;
}) => {
  return (
    <Link href={route} passHref>
      <a css={[s_pageLink.item]} className="group">
        <span css={[s_pageLink.icon]}>{icon}</span>
        <span css={[s_pageLink.text]}>{children}</span>
        <span css={[s_pageLink.linkArrowIcon]}>
          <ArrowRight />
        </span>
      </a>
    </Link>
  );
};

const s_pageLink = {
  item: tw`flex gap-sm items-center cursor-pointer capitalize text-gray-800`,
  text: tw`hover:text-gray-900 transition-colors ease-in-out duration-75 text-xl`,
  icon: tw`text-xl text-gray-400`,
  linkArrowIcon: tw`text-xl translate-x-0 group-hover:translate-x-1 group-hover:opacity-100 opacity-0 text-blue-500 transition-all duration-75 ease-in-out`,
};
