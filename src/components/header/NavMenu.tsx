import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Article, List, SignOut } from "phosphor-react";
import { ROUTES } from "^constants/routes";
import tw from "twin.macro";
import { Fragment, ReactElement } from "react";

const routeData = [
  { name: "articles", route: ROUTES.ARTICLES, icon: <Article /> },
];

const NavMenu = () => {
  return (
    <Menu as="div" css={[s.menu]}>
      <Menu.Button css={[s.button]}>
        <List />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items as="nav" css={[s.items]}>
          {routeData.map((rd) => (
            <PageLink icon={rd.icon} route={rd.route} key={rd.name}>
              {rd.name}
            </PageLink>
          ))}
          <div css={[s.nonLinks]}>
            <button css={[s.item]} onClick={() => null} type="button">
              <span css={[s.icon]}>
                <SignOut />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NavMenu;

const s = {
  menu: tw`relative inline-block`,
  button: tw`text-3xl p-xxs`,
  items: tw`shadow-lg bottom-0 grid rounded-md gap-sm translate-y-full px-md py-lg absolute left-xxs origin-top-left bg-white`,
  nonLinks: tw`mt-sm`,
  item: tw`flex gap-sm px-xxs items-center cursor-pointer capitalize`,
  icon: tw`text-xl`,
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
      <a css={[s.item]}>
        <span css={[s.icon]}>{icon}</span>
        <span>{children}</span>
      </a>
    </Link>
  );
};
