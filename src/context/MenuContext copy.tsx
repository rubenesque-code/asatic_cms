import { createContext, ReactElement, useContext } from "react";
import { useImmer } from "use-immer";

import { checkObjectHasField } from "^helpers/general";

export type MenuIdentifiers = {
  type: string;
  typeItemId: string;
};

type MenuInitial = MenuIdentifiers & {
  order: number;
};

type Menu = MenuInitial & {
  isHovered: boolean;
  containerIsHovered: boolean;
};

type Actions = {
  updateMenuHover: (menu: MenuIdentifiers, isHovered: boolean) => void;
  updateContainerHover: (menu: MenuIdentifiers, isHovered: boolean) => void;
  checkAnotherMenuIsHovered: (menu: MenuIdentifiers) => boolean;
  checkContainerIsHovered: (menu: MenuIdentifiers) => boolean;
  addMenu: (menu: MenuIdentifiers) => void;
};

type ContextValue = [menus: Menu[], actions: Actions];
const Context = createContext<ContextValue>([[] as Menu[], {}] as ContextValue);

const findMenu = (type: string, typeItemId: string, menus: Menu[]) => {
  const menu = menus.find(
    (m) => m.type === type && m.typeItemId === typeItemId
  );

  return menu;
};

const MenuProvider = ({ children }: { children: ReactElement }) => {
  const [menus, setMenus] = useImmer<Menu[]>([]);
  console.log("menus:", menus);

  const addMenu = (menu: MenuInitial) => {
    console.log("adding menu...");

    const { type, typeItemId } = menu;
    const existingMenu = findMenu(type, typeItemId, menus);
    console.log("existingMenu:", existingMenu);
    if (existingMenu) {
      return;
    }

    setMenus((draft) => {
      draft.push({ ...menu, isHovered: false, containerIsHovered: false });
    });
  };

  const updateMenuHover = (
    { type, typeItemId }: MenuIdentifiers,
    isHovered: boolean
  ) => {
    setMenus((draft) => {
      const menu = findMenu(type, typeItemId, draft);
      if (!menu) {
        return;
      }
      menu.isHovered = isHovered;
    });
  };

  const updateContainerHover = (
    { type, typeItemId }: MenuIdentifiers,
    isHovered: boolean
  ) => {
    setMenus((draft) => {
      const menu = findMenu(type, typeItemId, draft);
      if (!menu) {
        return;
      }
      menu.containerIsHovered = isHovered;
    });
  };

  const checkAnotherMenuIsHovered = ({ type, typeItemId }: MenuIdentifiers) => {
    const menu = findMenu(type, typeItemId, menus);
    if (!menu) {
      return;
    }

    const order = menu.order;
    const lowerMenus = menus.filter((menu) => menu.order < order);

    for (let i = 0; i < lowerMenus.length; i++) {
      const menu = lowerMenus[i];
      if (menu.isHovered) {
        return true;
      }
    }

    return false;
  };

  const checkContainerIsHovered = ({ type, typeItemId }: MenuIdentifiers) => {
    const menu = findMenu(type, typeItemId, menus);
    if (!menu) {
      return;
    }

    return menu.containerIsHovered;
  };

  const value = [
    menus,
    {
      updateMenuHover,
      checkAnotherMenuIsHovered,
      updateContainerHover,
      checkContainerIsHovered,
      addMenu,
    },
  ] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useMenuContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[1]);
  if (contextIsEmpty) {
    throw new Error("useMenuProvider must be used within its provider!");
  }
  return context;
};

export { MenuProvider, useMenuContext };
