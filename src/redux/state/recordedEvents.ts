import {
  PayloadAction,
  createEntityAdapter,
  nanoid,
  createSlice,
} from "@reduxjs/toolkit";

import { recordedEventsApi } from "^redux/services/recordedEvents";

import { RecordedEvent } from "^types/recordedEvent";
import { createNewRecordedEvent } from "^data/createDocument";
import { JSONContent } from "@tiptap/core";
import {
  createGenericDisplayContentReducers,
  createTestReducers,
} from "./generic-reducers/display-content";
import { Expand } from "^types/utilities";

type Entity = RecordedEvent;
type EntityTranslation = RecordedEvent["translations"][number];

type EntityPayloadGeneric = { id: string };
type TranslationPayloadGeneric = EntityPayloadGeneric & {
  translationId: string;
};

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const testRs = createTestReducers();
type A = Expand<typeof testRs>;

const slice = createSlice({
  name: "recordedEvents",
  initialState,
  reducers: {
    ...createTestReducers(),
    // ...createGenericDisplayContentReducers<EntityTranslation, Entity>(),
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
        adapter.addMany(state, payload);
      }
    );
  },
});

export default slice.reducer;

export const { addOne } = slice.actions;
// export actions

/* const slice = createPrimaryContentGenericSlice({
  name: "recordedEvents",
  initialState,
  reducers: {
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
 */
// export default slice.reducer;

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

/* function createTestReducers<
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
} */

/* const testReducers2: ValidateSliceCaseReducers<
  EntityState<Entity>,
  SliceCaseReducers<EntityState<Entity>>
> = {
  testReducer2(state, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    const entity = state.entities[id];
    if (entity) {
      entity.video = {
        id: "hello",
        youtubeId: "hello",
      };
    }
  },
}; */
