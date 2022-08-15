import { landingColorThemes } from "^data/landing";
import { PrimaryContentType } from "./primary-content";

export type LandingSectionCustomComponent = {
  id: string;
  docId: string;
  index: number;
  width: number;
  type: PrimaryContentType;
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
  contentType: PrimaryContentType | "collections";
};

export type LandingSection = LandingSectionCustom | LandingSectionAuto;

export type LandingColorTheme = keyof typeof landingColorThemes;
