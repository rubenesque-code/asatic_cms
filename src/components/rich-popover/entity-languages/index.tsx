import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";

import { useEntityLanguageContext } from "^context/EntityLanguages";
import { ComponentProvider, ParentEntityProp } from "./Context";
export * from "./Context";

import { Language } from "^types/language";

import Popover from "^components/ProximityPopover";
import Panel from "./panel";

export function EntityLanguagePopover({
  children: button,
  parentEntity,
}: {
  children: ReactElement;
} & ParentEntityProp) {
  return (
    <Popover>
      <>
        <ComponentProvider parentEntity={parentEntity}>
          <Popover.Panel>
            <Panel />
          </Popover.Panel>
        </ComponentProvider>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}

export function EntityLanguagePopoverButton({
  children,
}: {
  children: (language: Language | undefined) => ReactElement;
}) {
  const { activeLanguageId } = useEntityLanguageContext();
  const language = useSelector((state) =>
    selectLanguageById(state, activeLanguageId)
  );

  return children(language);
}
