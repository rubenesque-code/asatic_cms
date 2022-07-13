type ArticleComponent = {
  id: string;
  docId: string;
  order: number;
  width: number;
  type: "article";
};

export type LandingSectionCustomComponent = ArticleComponent;

export type LandingSectionCustom = {
  type: "custom";
  id: string;
  order: number;
  components: LandingSectionCustomComponent[];
};

export type LandingSectionAuto = {
  type: "auto";
  id: string;
  order: number;
  contentType: "article";
};

export type LandingSection = LandingSectionCustom | LandingSectionAuto;
