import { Switch } from "@headlessui/react";
import tw from "twin.macro";

import {
  $PanelContainer,
  $Heading,
  $Description,
} from "^components/rich-popover/_styles";
import { PublishFields } from "^types/entity";
import { useComponentContext } from "../Context";

export type PanelProps = {
  publishStatus: PublishFields["publishStatus"];
  togglePublishStatus: () => void;
};

const Panel = () => {
  const { publishStatus, togglePublishStatus } = useComponentContext();
  const isPublished = publishStatus === "published";

  return (
    <$PanelContainer css={[tw`w-[50ch]`]}>
      <$Heading>Publish Status</$Heading>
      <$Description>
        In draft mode, documents won&apos;t appear on the website.
      </$Description>
      <div css={[tw`mt-md`]}>
        <Switch.Group>
          <div css={[tw`flex gap-sm`]}>
            <Switch.Label css={[]}>Publish</Switch.Label>
            <Switch
              checked={isPublished}
              onChange={togglePublishStatus}
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
    </$PanelContainer>
  );
};

export default Panel;
