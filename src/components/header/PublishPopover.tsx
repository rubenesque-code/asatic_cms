import { Switch } from "@headlessui/react";
import tw from "twin.macro";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";

import { s_popover } from "^styles/popover";

type LabelProps = {
  isPublished: boolean;
};

type Props = PanelProps & LabelProps;

const PublishPopover = (props: Props) => {
  const { isPublished } = props;
  const publishStatus = isPublished ? "Published" : "Draft";

  return (
    <WithProximityPopover panel={<Panel {...props} />}>
      <WithTooltip text="Change publish status">
        <button css={[tw`text-sm`]}>{publishStatus}</button>
      </WithTooltip>
    </WithProximityPopover>
  );
};

export default PublishPopover;

type PanelProps = {
  isPublished: boolean;
  toggleStatus: () => void;
};

const Panel = ({ isPublished, toggleStatus }: PanelProps) => {
  return (
    <div css={[s_popover.panelContainer, tw`min-w-[35ch]`]}>
      <div>
        <h4 css={[s_popover.title]}>Publish Status</h4>
        <p css={[s_popover.explanatoryText]}>
          In draft mode, documents won&apos;t appear on the website.
        </p>
      </div>
      <div>
        <Switch.Group>
          <div css={[tw`flex gap-sm`]}>
            <Switch.Label css={[]}>Publish</Switch.Label>
            <Switch
              checked={isPublished}
              onChange={toggleStatus}
              css={[
                isPublished ? tw`bg-green-400` : tw`bg-gray-200`,
                tw`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ease-in-out duration-150`,
              ]}
            >
              <span
                css={[
                  isPublished ? tw`translate-x-6` : tw`translate-x-1`,
                  tw`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ease-in-out duration-150`,
                ]}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>
    </div>
  );
};
