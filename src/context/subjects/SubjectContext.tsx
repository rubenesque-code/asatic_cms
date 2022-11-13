import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";
import { ROUTES } from "^constants/routes";
import { mapLanguageIds } from "^helpers/general";

import { useDispatch, useSelector } from "^redux/hooks";
import { selectSubjectStatus } from "^redux/state/complex-selectors/entity-status/subject";
import {
  addTranslation,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  addRelatedEntity,
  removeRelatedEntity,
} from "^redux/state/subjects";

import { Subject, SubjectStatus } from "^types/subject";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SubjectSlice() {}

const actionsInitial = {
  addTranslation,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  addRelatedEntity,
  removeRelatedEntity,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id"> & {
  routeToEditPage: () => void;
};

type ContextValue = [
  subject: Subject & {
    languagesIds: string[];
    status: SubjectStatus;
  },
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

SubjectSlice.Provider = function SubjectProvider({
  subject: subject,
  children,
}: {
  subject: Subject;
  children: ReactElement | ((contextValue: ContextValue) => ReactElement);
}) {
  const { id, translations } = subject;
  const languagesIds = mapLanguageIds(translations);

  const status = useSelector((state) => selectSubjectStatus(state, subject));

  const dispatch = useDispatch();
  const router = useRouter();

  const actions: Actions = {
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    removeTranslation: (args) => dispatch(removeTranslation({ id, ...args })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    updatePublishDate: (args) => dispatch(updatePublishDate({ id, ...args })),
    updateSaveDate: (args) => dispatch(updateSaveDate({ id, ...args })),
    addRelatedEntity: (args) => dispatch(addRelatedEntity({ id, ...args })),
    removeRelatedEntity: (args) =>
      dispatch(removeRelatedEntity({ id, ...args })),
    routeToEditPage: () => router.push(`${ROUTES.SUBJECTS.route}/${id}`),
  };

  return (
    <Context.Provider value={[{ ...subject, languagesIds, status }, actions]}>
      {typeof children === "function"
        ? children([{ ...subject, languagesIds, status }, actions])
        : children}
    </Context.Provider>
  );
};

SubjectSlice.useContext = function useSubjectContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSubjectContext must be used within its provider!");
  }
  return context;
};
