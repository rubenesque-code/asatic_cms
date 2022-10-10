import { landingColorThemes } from "^data/landing";
import { PrimaryEntityType } from "./primary-entity";

export type LandingSectionCustomComponent = {
  id: string;
  docId: string;
  index: number;
  width: number;
  type: PrimaryEntityType;
};

export type LandingSectionCustom = {
  type: "custom";
  id: string;
  index: number;
  components: LandingSectionCustomComponent[];
};

export type LandingSectionAuto = {
  type: "auto";
  id: string;
  index: number;
  contentType: PrimaryEntityType | "collection";
};

export type LandingSection = LandingSectionCustom | LandingSectionAuto;

export type LandingColorTheme = keyof typeof landingColorThemes;
