import { createContext, ReactElement, useContext } from "react";
import { useImmer } from "use-immer";

import { checkObjectHasField } from "^helpers/general";

type InitialMenu = {
  id: string;
  order: number;
};

type Menu = InitialMenu & {
  isHovered: boolean;
  containerIsHovered: boolean;
};

type Actions = {
  updateMenuHover: (id: string, isHovered: boolean) => void;
  updateContainerHover: (id: string, isHovered: boolean) => void;
  checkAnotherMenuIsHovered: (id: string) => boolean;
  checkContainerIsHovered: (id: string) => boolean;
};

type ContextValue = [menus: Menu[], actions: Actions];
const Context = createContext<ContextValue>([[] as Menu[], {}] as ContextValue);

const MenusProvider = ({
  children,
  menus: menusInitial,
}: {
  children: ReactElement;
  menus: InitialMenu[];
}) => {
  const [menus, setMenus] = useImmer<Menu[]>(
    menusInitial.map((mi) => ({
      ...mi,
      isHovered: false,
      containerIsHovered: false,
    }))
  );

  const updateMenuHover = (id: string, isHovered: boolean) => {
    setMenus((draft) => {
      const menu = draft.find((menu) => menu.id === id)!;
      if (!menu) {
        throw new Error("menu does not exist");
      }
      menu.isHovered = isHovered;
    });
  };

  const updateContainerHover = (id: string, isHovered: boolean) => {
    setMenus((draft) => {
      const menu = draft.find((menu) => menu.id === id)!;
      if (!menu) {
        throw new Error("menu does not exist");
      }
      menu.containerIsHovered = isHovered;
    });
  };

  const checkAnotherMenuIsHovered = (id: string) => {
    const menu = menus.find((menu) => menu.id === id);
    if (!menu) {
      throw new Error("menu does not exist");
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

  const checkContainerIsHovered = (id: string) => {
    const menu = menus.find((menu) => menu.id === id);
    if (!menu) {
      throw new Error("menu does not exist");
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
    },
  ] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useMenusContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[1]);
  if (contextIsEmpty) {
    throw new Error("useMenuProvider must be used within its provider!");
  }
  return context;
};

export { MenusProvider, useMenusContext };
