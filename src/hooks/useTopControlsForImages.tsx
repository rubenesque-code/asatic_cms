import { useRef } from "react";
import isEqual from "lodash.isequal";

import {
  arrayConvergenceObjWithId,
  arrayDivergenceObjWithId,
  mapIds,
} from "^helpers/general";

import useUpdateablePrevious from "./useUpdateablePrevious";

import { useDispatch, useSelector } from "^redux/hooks";

import { overwriteSome, selectAll } from "^redux/state/images";

import { Image } from "^types/image";

function useTopControlsForImages({ saveId }: { saveId: string | undefined }) {
  const currentImages = useSelector(selectAll);
  const initialImages = useUpdateablePrevious({
    currentData: currentImages,
    dependencyToUpdateOn: saveId,
  });

  const newImagesInitialDataRef = useRef<Image[]>([]);
  const newImagesInitialData = newImagesInitialDataRef.current;

  const newImagesCurrentData = arrayDivergenceObjWithId(
    currentImages,
    initialImages
  );

  for (let i = 0; i < newImagesCurrentData.length; i++) {
    const newImage = newImagesCurrentData[i];

    const newImagesInitialDataIds = mapIds(newImagesInitialData);
    if (!newImagesInitialDataIds.includes(newImage.id)) {
      newImagesInitialData.push(newImage);
    }
  }

  const newImagesWithChanges = newImagesCurrentData.filter((newImageCurr) => {
    const newImageInit = newImagesInitialData.find(
      (newImageInit) => newImageInit.id === newImageCurr.id
    )!;
    const isChange = !isEqual(newImageCurr, newImageInit);

    return isChange;
  });

  const persistedImagesCurrentData = arrayConvergenceObjWithId(
    currentImages,
    initialImages
  );
  const persistedImagesInitialData = persistedImagesCurrentData.map(
    (persistedI) => initialImages.find((initI) => initI.id === persistedI.id)
  ) as Image[];

  for (let i = 0; i < persistedImagesCurrentData.length; i++) {
    const currentImage = persistedImagesCurrentData[i];

    const persistedImagesInitialDataIds = mapIds(persistedImagesInitialData);
    if (!persistedImagesInitialDataIds.includes(currentImage.id)) {
      persistedImagesInitialData.push(currentImage);
    }
  }

  const persistedImagesWithChanges = persistedImagesCurrentData.filter(
    (persistedImageCurr) => {
      const persistedImageInit = persistedImagesInitialData.find(
        (persistedImageInit) => persistedImageInit.id === persistedImageCurr.id
      )!;
      const isChange = !isEqual(persistedImageCurr, persistedImageInit);

      return isChange;
    }
  );

  const changedImages = [
    ...newImagesWithChanges,
    ...persistedImagesWithChanges,
  ];
  const isChange = Boolean(changedImages.length);

  const dispatch = useDispatch();

  const undo = () => {
    if (!isChange) {
      return;
    }
    dispatch(
      overwriteSome({
        images: [...newImagesInitialData, ...persistedImagesInitialData],
      })
    );
  };

  return {
    isChange,
    saveData: {
      newAndUpdated: changedImages,
    },
    handleUndo: undo,
  };
}

export default useTopControlsForImages;
