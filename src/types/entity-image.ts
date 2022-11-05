type ImageFieldsNameMap = {
  ["aspect-ratio"]: "aspectRatio";
  ["y-position"]: "vertPosition";
  id: "imageId";
  toggleable: "useImage";
};

type ImageFieldsHelper<
  TFields extends {
    [k in ImageFieldsNameMap[keyof ImageFieldsNameMap]]?: unknown;
  }
> = TFields;

type ImageFieldsValueMap = ImageFieldsHelper<{
  aspectRatio?: number;
  imageId?: string;
  useImage?: boolean;
  vertPosition?: number;
}>;

export type ImageFields<TName extends keyof ImageFieldsNameMap> = {
  [k in ImageFieldsNameMap[TName]]?: ImageFieldsValueMap[k];
};

export type SummaryImageField<
  TIsToggleable extends "isToggleable" | "isNotToggleable"
> = {
  summaryImage: ImageFields<
    TIsToggleable extends "isToggleable"
      ? "toggleable" | "id" | "y-position"
      : "id" | "y-position"
  >;
};

export type LandingCustomSectionImageField = {
  landingCustomSectionImage: ImageFields<"aspect-ratio" | "y-position">;
};
