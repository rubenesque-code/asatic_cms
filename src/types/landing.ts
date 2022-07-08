type ArticleComponent = {
  id: string;
  docId: string;
  order: number;
  width: 1 | 2 | 3;
  type: "article";
};

export type LandingSectionCustom = {
  type: "custom";
  id: string;
  order: number;
  components: ArticleComponent[];
};

export type LandingSectionAuto = {
  type: "auto";
  id: string;
  order: number;
  contentType: "article";
};

export type LandingSection = LandingSectionCustom | LandingSectionAuto;
