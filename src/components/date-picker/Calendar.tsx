import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";

import { ReactElement } from "react";
import { Calendar } from "react-date-range";

const CalendarComponent = ({
  date,
  onChange,
}: {
  date: Date | undefined;
  onChange: (date: Date) => void;
}): ReactElement => <Calendar date={date} onChange={onChange} />;

export default CalendarComponent;
