type ImageFieldsMap = {
  imageId?: string;
  vertPosition?: number;
  aspectRatio?: number;
  useImage?: boolean;
};

export type ImageFields<TField extends keyof ImageFieldsMap> = Pick<
  ImageFieldsMap,
  TField
>;

export type SummaryImageField<
  TIsToggleable extends "isToggleable" | "isNotToggleable"
> = {
  summaryImage: ImageFields<
    TIsToggleable extends "isToggleable"
      ? "useImage" | "imageId" | "vertPosition"
      : "imageId" | "vertPosition"
  >;
};

export type LandingCustomSectionImageField = {
  landingCustomSectionImage: ImageFields<"aspectRatio" | "vertPosition">;
};
