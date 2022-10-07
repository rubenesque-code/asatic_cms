import { ComponentProps } from "react";

import { MyOmit } from "^types/utilities";

import FiltersUI from "^components/FiltersUI";
import CreateButtonUI from "^components/display-entities-page/CreateButtonUI";
import MainUI from "^components/display-entities-page/MainUI";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RecordedEventsUI() {}

RecordedEventsUI.BodySkeleton = function BodySkeleton(
  props: MyOmit<ComponentProps<typeof MainUI>, "title">
) {
  return <MainUI title="Recorded Events" {...props} />;
};

RecordedEventsUI.CreateButton = function CreateButton(
  props: Pick<ComponentProps<typeof CreateButtonUI>, "onClick">
) {
  return <CreateButtonUI docType="recorded event" {...props} />;
};

RecordedEventsUI.FiltersSkeleton = FiltersUI;
