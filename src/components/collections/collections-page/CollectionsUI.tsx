import { ComponentProps } from "react";
import FiltersUI from "^components/FiltersUI";
import CreateButtonUI from "^components/display-entities-page/CreateButtonUI";
import MainUI from "^components/display-entities-page/MainUI";
import { MyOmit } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function CollectionsUI() {}

CollectionsUI.BodySkeleton = function BodySkeleton(
  props: MyOmit<ComponentProps<typeof MainUI>, "title">
) {
  return <MainUI title="Collections" {...props} />;
};

CollectionsUI.CreateButton = function CreateButton(
  props: Pick<ComponentProps<typeof CreateButtonUI>, "onClick">
) {
  return <CreateButtonUI docType="collection" {...props} />;
};

CollectionsUI.FiltersSkeleton = FiltersUI;
