import {
  EntityState,
  nanoid,
  PayloadAction,
  SliceCaseReducers,
  Draft,
  ValidateSliceCaseReducers,
  Reducer,
  CaseReducer,
  CaseReducerWithPrepare,
  Action,
} from "@reduxjs/toolkit";

import {
  Publishable,
  TrackSave,
  TranslationGeneric,
} from "^types/display-content";

type EntityPayloadGeneric = { id: string };
type TranslationPayloadGeneric = EntityPayloadGeneric & {
  translationId: string;
};

// type MyCaseReducerWithPrepare<> =

export function createGenericDisplayContentReducers<
  TTranslation extends TranslationGeneric,
  TEntity extends { id: string; translations: TTranslation[] } & Publishable &
    TrackSave
>(): {
  togglePublishStatus: CaseReducer<
    EntityState<TEntity>,
    PayloadAction<EntityPayloadGeneric>
  >;
  updatePublishDate: CaseReducer<
    EntityState<TEntity>,
    PayloadAction<EntityPayloadGeneric & { date: Date }>
  >;
  updateSaveDate: CaseReducer<
    EntityState<TEntity>,
    PayloadAction<EntityPayloadGeneric & { date: Date }>
  >;
  removeTranslation: CaseReducer<
    EntityState<TEntity>,
    PayloadAction<TranslationPayloadGeneric>
  >;
  addTranslation: CaseReducerWithPrepare<
    EntityState<TEntity>,
    PayloadAction<TranslationPayloadGeneric>
  >;
} {
  return {
    togglePublishStatus: (
      state,
      action: PayloadAction<EntityPayloadGeneric>
    ) => {
      const { id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const currentStatus = entity.publishStatus;
        entity.publishStatus =
          currentStatus === "draft" ? "published" : "draft";
      }
    },
    updatePublishDate: (
      state,
      action: PayloadAction<EntityPayloadGeneric & { date: Date }>
    ) => {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.publishDate = date;
      }
    },
    updateSaveDate: (
      state,
      action: PayloadAction<EntityPayloadGeneric & { date: Date }>
    ) => {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.lastSave = date;
      }
    },
    addTranslation: {
      reducer(
        state,
        action: PayloadAction<{ id: string; newTranslation: EntityTranslation }>
      ) {
        const { newTranslation, id } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.translations.push(newTranslation);
        }
      },
      prepare(payload: { languageId: string; id: string }) {
        const { id, languageId } = payload;
        return {
          payload: {
            id,
            newTranslation: {
              id: nanoid(),
              languageId,
            },
          },
        };
      },
    },
    removeTranslation: (
      state,
      action: PayloadAction<TranslationPayloadGeneric>
    ) => {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === translationId);

        translations.splice(index, 1);
      }
    },
  };
}

// export default createGenericDisplayContentReducers;

export function createTestReducers<
  TTranslation extends { id: string; languageId: string },
  TEntity extends { id: string; translations: TTranslation[] }
>(): SliceCaseReducers<EntityState<TEntity>> {
  return {
    testReducer1(
      state,
      action: PayloadAction<{ id: string; translationId: string }>
    ) {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === translationId);

        translations.splice(index, 1);
      }
    },
  };
}

const a = createTestReducers();

type ISTT = typeof a;

const x = { ...a };

function test() {
  return {
    a: "hello",
    b: "goobdy",
    c() {
      console.log("hello");
    },
  };
}

function createTestReducers2<
  TTranslation extends { id: string; languageId: string },
  TEntity extends { id: string; translations: TTranslation[] }
>(): ValidateSliceCaseReducers<
  EntityState<TEntity>,
  SliceCaseReducers<EntityState<TEntity>>
> {
  return {
    testReducer1(
      state,
      action: PayloadAction<{ id: string; translationId: string }>
    ) {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === translationId);

        translations.splice(index, 1);
      }
    },
  };
}

const test4: Reducer<
  EntityState<{ id: string; text: string }>,
  PayloadAction<{ id: string }>
> = (state, action) => {
  const { id } = action.payload;
  const entity = state?.entities[id];
  if (entity) {
    entity.text = "hello";
  }
};

export function createTestReducer<
  TTranslation extends { id: string; languageId: string },
  TEntity extends { id: string; translations: TTranslation[] }
>(): {
  testReducer: CaseReducer<
    EntityState<TEntity>,
    PayloadAction<EntityPayloadGeneric>
  >;
} {
  return {
    testReducer: (state, action) => {
      const { id } = action.payload;
      const entity = state?.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === "hello");

        translations.splice(index, 1);
      }
    },
  };
}
