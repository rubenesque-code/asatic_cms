import { MyOmit } from "^types/utilities";

import { SubjectIcon } from "^components/Icons";
import {
  SubjectsPopoverButton_,
  SubjectsPopover_,
  SubjectsPopover_Props,
} from "^components/rich-popover/subjects";
import $RelatedEntityButton_ from "../_presentation/$RelatedEntityButton_";
import { selectEntitySubjectsStatus } from "^redux/state/complex-selectors/entity-status/subject";

export const HeaderSubectsPopover_ = (
  props: MyOmit<SubjectsPopover_Props, "children">
) => {
  return (
    <SubjectsPopover_ {...props}>
      <Button />
    </SubjectsPopover_>
  );
};

const Button = () => {
  return (
    <SubjectsPopoverButton_>
      {({ subjectsStatus }) => (
        <$RelatedEntityButton_
          status={interpretSubjectsStatusForButton(subjectsStatus)}
          entityName="subject"
        >
          <SubjectIcon />
        </$RelatedEntityButton_>
      )}
    </SubjectsPopoverButton_>
  );
};

type EntitySubjectsStatus = ReturnType<typeof selectEntitySubjectsStatus>;

const interpretSubjectsStatusForButton = (statusArr: EntitySubjectsStatus) => {
  const isUndefined = statusArr.find((status) => status === "undefined");
  if (isUndefined) {
    return "missing entity";
  }

  const isInvalid = statusArr.find(
    (status) => typeof status === "object" && status.status === "invalid"
  );
  if (isInvalid) {
    return "invalid entity";
  }

  const isMissingTranslation = statusArr.find(
    (status) =>
      typeof status === "object" &&
      status.status === "warning" &&
      status.warnings?.includes("missing translation for parent language")
  );
  if (isMissingTranslation) {
    return "missing translation";
  }

  return "good";
};
