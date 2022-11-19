import { landingColorThemes } from "^data/landing";
import { DisplayEntityNameSubset, ComponentFields } from "./entity";

type SectionType = "auto" | "user";

type Section<TType extends SectionType> = ComponentFields<"id" | "index"> & {
  type: TType;
};

export type UserSection = Section<"user"> & {
  components: UserComponent[];
};

export type UserComponent = ComponentFields<"id" | "index" | "width"> & {
  entity: {
    id: string;
    type: DisplayEntityNameSubset<"article" | "blog" | "recordedEvent">;
  };
};

export type AutoSection = Section<"auto"> & {
  contentType: DisplayEntityNameSubset<
    "article" | "blog" | "collection" | "recordedEvent"
  >;
};

export type LandingSection = UserSection | AutoSection;

export type LandingColorTheme = keyof typeof landingColorThemes;

/* const u: UserSection = {
  components: [
    { entity: { id: "", type: "article" }, id: "", index: 0, width: 2 },
  ],
  id: "",
  index: 0,
  type: "user",
};

const a: AutoSection = {
  contentType: 'article',
  id: '',
  index: 0,
  type: 'auto'
};
 */
