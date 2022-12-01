import tw from "twin.macro";
import { ReactElement, cloneElement } from "react";

import { EntityAsChildStatus } from "^types/entity-status";

import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { InvalidIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";

import { $TranslationDivider } from "../_styles/relatedEntities";

export const $RelatedEntity_ = ({
  menu,
  entity,
}: {
  menu: ReactElement;
  entity: ReactElement;
}) => (
  <div css={[tw`flex items-center`]} className="group">
    <div css={[tw`mr-xxxs`]}>{menu}</div>
    <div css={[tw`w-[3px] flex-shrink-0 self-stretch bg-green-200 mr-sm`]} />
    <div>{entity}</div>
  </div>
);

export const $MissingEntity = ({ entityType }: { entityType: string }) => {
  return (
    <div css={[tw`inline-block`]}>
      <SubContentMissingFromStore subContentType={entityType}>
        Missing
      </SubContentMissingFromStore>
    </div>
  );
};

export function $Entity_<TMissingRequiremnt extends string>({
  status,
  text,
}: {
  text: ReactElement;
  status: EntityAsChildStatus<TMissingRequiremnt>;
}) {
  return (
    <div css={[tw`flex items-center gap-xs`]}>
      {status === "good" ||
      status === "undefined" ||
      (typeof status === "object" && status.status === "warning") ? null : (
        <WithTooltip
          text={
            status === "draft"
              ? "unpublished"
              : {
                  header: "Invalid",
                  body: status.missingRequirements.join(", "),
                }
          }
        >
          <span css={[tw`text-red-warning mr-sm`]}>
            <InvalidIcon />
          </span>
        </WithTooltip>
      )}
      {text}
    </div>
  );
}

export const $EntityTranslations = ({
  activeTranslations,
  inactiveTranslations,
}: {
  activeTranslations: ReactElement[];
  inactiveTranslations?: ReactElement[];
}) => (
  <div css={[tw`flex items-center gap-xs`]}>
    {activeTranslations.map((child, i) => (
      <div css={[tw`flex gap-sm items-baseline`]} key={i}>
        {i !== 0 ? <$TranslationDivider /> : null}
        {cloneElement(child)}
      </div>
    ))}
    {inactiveTranslations?.length
      ? inactiveTranslations.map((child, i) => (
          <div css={[tw`flex gap-sm items-baseline`]} key={i}>
            <$TranslationDivider />
            {cloneElement(child)}
          </div>
        ))
      : null}
  </div>
);

export const $MissingTranslationText = () => {
  return (
    <WithTooltip text="missing translation">
      <div css={[tw`flex items-baseline gap-xxxs w-full justify-center`]}>
        <span css={[tw`text-red-warning`]}>.....</span>
      </div>
    </WithTooltip>
  );
};
