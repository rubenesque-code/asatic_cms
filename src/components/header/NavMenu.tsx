import { ReactElement } from "react";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import tw, { css } from "twin.macro";
import { ArrowRight, Article, List, SignOut } from "phosphor-react";

import { ROUTES } from "^constants/routes";

import s_button from "^styles/button";

const routeData = [
  { name: "articles", route: ROUTES.ARTICLES, icon: <Article /> },
];

const NavMenu = () => {
  return (
    <Menu as="div" css={[s.menu]}>
      <Menu.Button css={[s.button]}>
        <List />
      </Menu.Button>
      <Menu.Items as="nav" css={[s.items]}>
        {routeData.map((rd) => (
          <PageLink icon={rd.icon} route={rd.route} key={rd.name}>
            {rd.name}
          </PageLink>
        ))}
        <div css={[s.nonLinks]}>
          <button
            css={[s.item]}
            className="group"
            onClick={() => null}
            type="button"
          >
            <span css={[s.icon, s.logoutIcon]}>
              <SignOut />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default NavMenu;

const s = {
  menu: tw`relative inline-block`,
  button: css`
    ${s_button.icon} ${s_button.selectors} ${tw`text-2xl`}
  `,
  items: tw`shadow-lg bottom-0 grid rounded-md gap-sm translate-y-full px-md py-lg absolute left-xxs origin-top-left bg-white`,
  item: tw`flex gap-sm py-xxs px-xs items-center cursor-pointer capitalize`,
  nonLinks: tw`mt-sm`,
  icon: tw`text-xl`,
  linkArrowIcon: tw`group-hover:visible invisible group-hover:translate-x-1 group-hover:opacity-100 opacity-0 text-blue-500 transition-all duration-75 ease-in-out`,
  logoutIcon: tw`group-hover:text-red-500 text-black transition-colors duration-75 ease-in-out`,
};

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
    <Link href={route}>
      <a css={[s.item]} className="group">
        <span css={[s.icon]}>{icon}</span>
        <span>{children}</span>
        <span css={[s.linkArrowIcon]}>
          <ArrowRight />
        </span>
      </a>
    </Link>
  );
};
