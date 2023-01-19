import { DisplayEntityNameSubset, ComponentFields } from "./entity";

export type LandingCustomSectionComponent = ComponentFields<"id" | "index"> & {
  section: 0 | 1;
  width: 1 | 2;
  entity: {
    id: string;
    type: DisplayEntityNameSubset<"article" | "blog">;
  };
  languageId: "english" | "tamil";
};
