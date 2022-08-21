import {
  PayloadAction,
  createEntityAdapter,
  nanoid,
  ValidateSliceCaseReducers,
  EntityState,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import { recordedEventsApi } from "^redux/services/recordedEvents";

import createPrimaryContentGenericSlice from "./higher-order-reducers/primaryContentGeneric";

import { RecordedEvent } from "^types/recordedEvent";
import { createNewRecordedEvent } from "^data/createDocument";
import { JSONContent } from "@tiptap/core";

type Entity = RecordedEvent;
type EntityTranslation = RecordedEvent["translations"][number];

type EntityPayloadGeneric = { id: string };
type TranslationPayloadGeneric = EntityPayloadGeneric & {
  translationId: string;
};

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

function createTestReducers<
  TTranslation extends { id: string; languageId: string },
  TEntity extends { id: string; translations: TTranslation[] }
>(): ValidateSliceCaseReducers<
  EntityState<TEntity>,
  SliceCaseReducers<EntityState<TEntity>>
> {
  return {
    testReducer(
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

const testReducers1 = createTestReducers<EntityTranslation, Entity>();

const testReducers2: ValidateSliceCaseReducers<
  EntityState<Entity>,
  SliceCaseReducers<EntityState<Entity>>
> = {
  testReducer(state, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    const entity = state.entities[id];
    if (entity) {
      entity.video = {
        id: "hello",
        youtubeId: "hello",
      };
    }
  },
};

const slice = createPrimaryContentGenericSlice({
  name: "recordedEvents",
  initialState,
  reducers: {
    ...testReducers1,
    ...testReducers2,
    undoOne: adapter.setOne,
    undoAll: adapter.setAll,
    addOne: {
      reducer(state, action: PayloadAction<Entity>) {
        const entity = action.payload;
        adapter.addOne(state, entity);
      },
      prepare() {
        return {
          payload: createNewRecordedEvent({
            id: nanoid(),
            translationId: nanoid(),
          }),
        };
      },
    },
    removeOne(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
    updateVideoSrc: {
      reducer(
        state,
        action: PayloadAction<
          EntityPayloadGeneric & {
            videoId: string;
            youtubeId: string;
          }
        >
      ) {
        const { id, videoId, youtubeId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.video = {
            id: entity.video?.id || videoId,
            youtubeId,
          };
        }
      },
      prepare(payload: EntityPayloadGeneric & { youtubeId: string }) {
        return { payload: { ...payload, videoId: nanoid() } };
      },
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
    removeTranslation(state, action: PayloadAction<TranslationPayloadGeneric>) {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === translationId);

        translations.splice(index, 1);
      }
    },
    updateTitle(
      state,
      action: PayloadAction<
        TranslationPayloadGeneric & {
          title: string;
        }
      >
    ) {
      const { id, title, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.title = title;
        }
      }
    },
    updateBody(
      state,
      action: PayloadAction<
        TranslationPayloadGeneric & {
          body: JSONContent;
        }
      >
    ) {
      const { id, body, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.body = body;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      recordedEventsApi.endpoints.fetchRecordedEvents.matchFulfilled,
      (state, { payload }) => {
        // todo: upsert not correct
        adapter.addMany(state, payload);
      }
    );
  },
});

export default slice.reducer;

// const actions = slice.actions;
// const {undoOne, undoAll} = actions
// undoOne({})
// undoAll([])

// undoOne, undoAll + removeONe can use adapter utilities
/*     undoOne(
      state,
      action: PayloadAction<{
        data: Entity;
      }>
    ) {
      const { data } = action.payload;
      adapter.setOne(state, data);
    }, */
/*     undoAll(
      state,
      action: PayloadAction<{
        data: Entity[];
      }>
    ) {
      const { data } = action.payload;
      adapter.setAll(state, data);
    }, */
