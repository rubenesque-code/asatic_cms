import { createContext, ReactElement, useContext, useState } from "react";

import { checkObjectHasField } from "^helpers/general";

export type Menu = {
  type: string;
  typeItemId: string;
};

type Actions = {
  updateHoveredMenu: (menu: Menu | null) => void;
};

type ContextValue = [hoveredMenu: Menu, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const MenusProvider = ({ children }: { children: ReactElement }) => {
  const [hoveredMenu, setHoveredMenu] = useState<Menu | null>(null);

  const updateHoveredMenu = (menu: Menu | null) => {
    if (menu) {
      setHoveredMenu(menu);
    } else {
      setHoveredMenu(null);
    }
  };

  const value = [
    hoveredMenu,
    {
      updateHoveredMenu,
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
