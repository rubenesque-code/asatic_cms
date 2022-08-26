import isEqual from "lodash.isequal";

import { useDispatch, useSelector } from "^redux/hooks";
import { undoAll as undoArticles } from "^redux/state/articles";
import { undoAll as undoBlogs } from "^redux/state/blogs";
import { undoOne as undoCollection } from "^redux/state/collections";
import { overWriteAll as undoSubjects } from "^redux/state/subjects";

import useUpdateablePrevious from "^hooks/useUpdateablePrevious";
import { ActionCreatorWithPayload, Dictionary } from "@reduxjs/toolkit";
// todo: and whatabout images?!!

function dicToArr<TEntity extends { id: string }>(
  entities: Dictionary<TEntity>
) {
  return Object.values(entities).flatMap((s) => (s ? [s] : []));
}

function useCollectionPageSaveUndo({
  collectionId,
  saveId,
}: {
  collectionId: string;
  saveId: string | undefined;
}) {
  const currentData = useSelector((state) => {
    return {
      articles: dicToArr(state["articles"].entities),
      blogs: dicToArr(state["blogs"].entities),
      collection: state["collections"].entities[collectionId]!,
      images: dicToArr(state["images"].entities),
      recordedEvents: dicToArr(state["recordedEvents"].entities),
      subjects: dicToArr(state["subjects"].entities),
      tags: dicToArr(state["tags"].entities),
    };
  });

  const previousData = useUpdateablePrevious({
    currentData,
    updateOn: saveId,
  });

  const isChange = !isEqual(currentData, previousData);

  type Data = typeof previousData;
  type DataKey = keyof Data;

  const dispatch = useDispatch();

  function undoEntityData<TKey extends DataKey>(
    key: TKey,
    actionCreator: ActionCreatorWithPayload<Data[TKey], string>
  ) {
    const currData = currentData[key];
    const prevData = previousData[key];

    const isChange = !isEqual(currData, prevData);
    if (!isChange) {
      return;
    }
    dispatch(actionCreator(prevData));
    // dispatch(undoActionCreatorDic[key](prevData))
  }

  function undo() {
    undoEntityData("collection", undoCollection);
    undoEntityData("subjects", undoSubjects);
  }

  return {
    isChange,
    currentData,
    undo,
  };
}

export default useCollectionPageSaveUndo;

/*   type Undo<TKey extends DataKey> = {
    field: TKey;
    // isChange: boolean;
    undo: (data: Data[TKey]) => void;
  }; */
/*   function createUndo<TKey extends DataKey>(field: TKey):Undo<TKey>{
    return {
      field,
      undo:  

    }
  } */

/*   const a = () =>
    undoAll([
      { key: "collection", actionCreator: undoActionCreatorDic["collection"] },
      { key: "subjects", actionCreator: undoActionCreatorDic["subjects"] },
    ]); */
/*   function undoAll<TKey extends DataKey>(
    undoMap: {
      key: TKey;
      actionCreator: typeof undoActionCreatorDic[TKey]
    }[]
  ) {
    for (let i = 0; i < undoMap.length; i++) {
      const { actionCreator, key } = undoMap[i];
      undoEntityData(key, actionCreator);
    }
  } */
