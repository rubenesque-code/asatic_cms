import { Popover } from "@headlessui/react";
import tw from "twin.macro";

import { formatDateDMYStr } from "^helpers/general";

import Calendar from "./Calendar";
import WithTooltip from "^components/WithTooltip";

const DatePicker = ({
  align = "left",
  date,
  onChange,
  placeholder = "date",
  languageId,
}: {
  align?: "left" | "center" | "right";
  date: Date | undefined;
  onChange: (date: Date) => void;
  placeholder?: string;
  languageId: string;
}) => {
  const xPositionClassName =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  const dateStr = date
    ? languageId === "english"
      ? formatDateDMYStr(date, "en")
      : languageId === "tamil"
      ? formatDateDMYStr(date, "ta")
      : formatDateDMYStr(date)
    : placeholder;

  return (
    <Popover css={[tw`relative z-40`]}>
      <WithTooltip text="click to select date">
        <Popover.Button>
          <span css={[tw`text-gray-700`, !date && tw`text-gray-placeholder`]}>
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
