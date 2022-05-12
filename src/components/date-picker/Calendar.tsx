import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";

import { ReactElement } from "react";
import { Calendar } from "react-date-range";
import tw from "twin.macro";

const CalendarComponent = ({
  date,
  onChange,
}: {
  date: Date | undefined;
  onChange: (date: Date) => void;
}): ReactElement => (
  <div css={[tw`z-30 bg-white`]}>
    <Calendar date={date} onChange={onChange} />
  </div>
);

export default CalendarComponent;
