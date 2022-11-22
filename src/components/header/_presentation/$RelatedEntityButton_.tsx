import { ReactElement } from "react";
import tw from "twin.macro";

import { InvalidIcon, MissingIcon, TranslateIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";
import { entityNameToLabel } from "^constants/data";
import { EntityName } from "^types/entity";

import $IconButton_ from "../_presentation/$IconButton_";

// todo: status type from EntityAsChildStatus
const $RelatedEntityButton_ = ({
  children: icon,
  status,
  entityName,
}: {
  children: ReactElement;
  status: "missing entity" | "invalid entity" | "missing translation" | "good";
  entityName: EntityName;
}) => {
  const tooltip =
    status !== "good"
      ? `${entityNameToLabel(entityName)}s contains ${status}`
      : `${entityName}s`;

  return (
    <div css={[tw`relative`]}>
      <$IconButton_ tooltip={tooltip}>{icon}</$IconButton_>
      {status?.length ? (
        <WithTooltip text={tooltip}>
          <div
            css={[
              tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90 flex items-center gap-xxxs`,
            ]}
          >
            {status === "missing entity" ? (
              <span css={[tw`text-red-warning`]}>
                <MissingIcon />
              </span>
            ) : status === "invalid entity" ? (
              <span css={[tw`text-red-warning`]}>
                <InvalidIcon />
              </span>
            ) : status === "missing translation" ? (
              <span css={[tw`text-orange-500`]}>
                <TranslateIcon />
              </span>
            ) : null}
          </div>
        </WithTooltip>
      ) : null}
    </div>
  );
};

export default $RelatedEntityButton_;
