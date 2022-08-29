import { ComponentProps } from "react";
import FiltersUI from "^components/FiltersUI";
import CreateButtonUI from "^components/display-content-items-page/CreateButtonUI";
import MainUI from "^components/display-content-items-page/MainUI";
import { MyOmit } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ArticlesUI() {}

ArticlesUI.BodySkeleton = function BodySkeleton(
  props: MyOmit<ComponentProps<typeof MainUI>, "title">
) {
  return <MainUI title="Articles" {...props} />;
};

ArticlesUI.CreateArticleButton = function CreateButton(
  props: Pick<ComponentProps<typeof CreateButtonUI>, "onClick">
) {
  return <CreateButtonUI docType="article" {...props} />;
};

ArticlesUI.FiltersSkeleton = FiltersUI;
