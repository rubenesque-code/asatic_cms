import {
  ActionReducerMapBuilder,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { RelatedEntityFields } from "^types/entity";
import { LandingCustomSectionImageField } from "^types/entity-image";
import {
  TranslationField,
  TranslationGlobalFields,
} from "^types/entity-translation";

import createDisplayContentGenericSlice, {
  DisplayEntity,
} from "./displayContentGeneric";

type PrimaryEntity<TTranslation extends TranslationGlobalFields> =
  DisplayEntity<TTranslation> &
    RelatedEntityFields<"author" | "collection" | "subject" | "tag"> &
    LandingCustomSectionImageField;

export default function createPrimaryContentGenericSlice<
  TTranslation extends TranslationField<"id" | "languageId">,
  TEntity extends PrimaryEntity<TTranslation>,
  Reducers extends SliceCaseReducers<EntityState<TEntity>>
>({
  name = "",
  initialState,
  reducers,
  extraReducers,
}: {
  name: string;
  initialState: EntityState<TEntity>;
  reducers: ValidateSliceCaseReducers<EntityState<TEntity>, Reducers>;
  extraReducers: (
    builder: ActionReducerMapBuilder<EntityState<TEntity>>
  ) => void;
}) {
  return createDisplayContentGenericSlice({
    name,
    initialState,
    reducers: {
      updateLandingCustomImageAspectRatio(
        state,
        action: PayloadAction<{ id: string; aspectRatio: number }>
      ) {
        const { id, aspectRatio } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.landingCustomSectionImage.aspectRatio = aspectRatio;
        }
      },
      updateLandingCustomImageVertPosition(
        state,
        action: PayloadAction<{ id: string; vertPosition: number }>
      ) {
        const { id, vertPosition } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.landingCustomSectionImage.vertPosition = vertPosition;
        }
      },
      ...reducers,
    },
    extraReducers,
  });
}
