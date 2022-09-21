import { landingColorThemes } from "^data/landing";
import { PrimaryContent } from "./primary-content";

export type LandingSectionCustomComponent = {
  id: string;
  docId: string;
  index: number;
  width: number;
  type: PrimaryContent;
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
  contentType: PrimaryContent | "collections";
};

export type LandingSection = LandingSectionCustom | LandingSectionAuto;

export type LandingColorTheme = keyof typeof landingColorThemes;
