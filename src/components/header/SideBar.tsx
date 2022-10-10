import { Menu, Transition } from "@headlessui/react";
import { ArrowRight, List, SignOut } from "phosphor-react";
import tw, { css } from "twin.macro";

import { signOut } from "^lib/firebase/authentication";

import {
  displayPageLinks,
  PageLink,
  secondaryPageLinks,
  s_pageLink,
} from "^components/EntitiesLinksList";

import s_button from "^styles/button";

const SideBar = () => {
  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button css={[s_top.button]}>
            <List />
          </Menu.Button>
          <Transition
            as="div"
            show={open}
            css={[s_top.panelShell]}
            enter="transition duration-100 ease-out"
            enterFrom="transform opacity-0 -translate-x-full"
            enterTo="transform opacity-100 translate-x-0"
            leave="transition duration-100 ease-out"
            leaveFrom="transform opacity-100 translate-x-0"
            leaveTo="transform opacity-0 -translate-x-full"
          >
            <Menu.Items css={[s_top.itemsContainer]}>
              <Content />
            </Menu.Items>
          </Transition>
          <Transition
            as="div"
            show={open}
            css={[s_top.overlay]}
            enter="transition duration-100 ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-100 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          />
        </>
      )}
    </Menu>
  );
};

export default SideBar;

const s_top = {
  button: css`
    ${s_button.icon} ${s_button.selectors} ${tw`text-2xl `}
  `,
  panelShell: tw`z-50 fixed top-0 left-0 h-screen`,
  itemsContainer: tw`bg-white py-sm pl-md pr-3xl border-r-2 h-full`,
  overlay: tw`z-40 fixed inset-0 bg-overlayMid`,
};

const Content = () => {
  return (
    <div css={[tw`flex flex-col gap-3xl h-full`]}>
      <div css={[tw`flex flex-col gap-xl items-start`]}>
        <div css={[tw`uppercase font-medium text-2xl`]}>Asatic</div>
        <div css={[tw`flex flex-col gap-sm items-start`]}>
          {displayPageLinks.map((link) => (
            <PageLink {...link} key={link.label}>
              <span css={[s_pageLink.linkArrowIcon]}>
                <ArrowRight />
              </span>
            </PageLink>
          ))}
        </div>
        <div css={[tw`flex flex-col gap-sm items-start`]}>
          {secondaryPageLinks.map((link) => (
            <PageLink {...link} key={link.label}>
              <span css={[s_pageLink.linkArrowIcon]}>
                <ArrowRight />
              </span>
            </PageLink>
          ))}
        </div>
      </div>
      <div>
        <Logout />
      </div>
    </div>
  );
};

const Logout = () => {
  return (
    <button
      css={[s_pageLink.item]}
      className="group"
      onClick={signOut}
      type="button"
    >
      <span
        css={[
          s_pageLink.icon,
          tw`group-hover:text-red-warning transition-colors ease-in-out duration-75`,
        ]}
      >
        <SignOut />
      </span>
      <span css={[s_pageLink.text]}>Logout</span>
    </button>
  );
};
