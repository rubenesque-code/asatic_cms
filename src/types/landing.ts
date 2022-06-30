type ArticleSection = {
  id: string;
  articleId: string;
  order: number;
  width: 1 | 2 | 3;
};

export type LandingSectionCustom = {
  type: "custom";
  id: string;
  order: number;
  sections: ArticleSection[];
};

export type LandingSectionAuto = {
  type: "auto";
  id: string;
  order: number;
};

export type LandingSection = LandingSectionCustom | LandingSectionAuto;
