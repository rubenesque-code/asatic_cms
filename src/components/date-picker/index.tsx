import { ReactElement } from "react";
import { Popover } from "@headlessui/react";

import { formatDateDMYStr } from "^helpers/general";

import Calendar from "./Calendar";
import tw, { css } from "twin.macro";
import WithTooltip from "^components/WithTooltip";

const DatePicker = ({
  align = "center",
  date,
  onChange,
}: {
  align?: "left" | "center" | "right";
  date: Date | undefined;
  onChange: (date: Date) => void;
}): ReactElement => {
  const xPositionClassName =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  const dateStr = date ? formatDateDMYStr(date) : "date here";

  return (
    <Popover css={[tw`relative z-40`]}>
      <WithTooltip text="click to select date">
        <Popover.Button>
          <span
            css={[
              css`
                ${date ? tw`` : tw`text-gray-placeholder`}
              `,
            ]}
          >
            {dateStr}
          </span>
        </Popover.Button>
      </WithTooltip>
      <Popover.Panel
        className={`absolute top-3 z-20 ${xPositionClassName} shadow-md`}
      >
        <Calendar date={date} onChange={onChange} />
      </Popover.Panel>
    </Popover>
  );
};

export default DatePicker;
