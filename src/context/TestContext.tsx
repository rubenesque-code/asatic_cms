import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Object } from "ts-toolbelt";

import { useDispatch } from "^redux/hooks";
import { updateBodyImageAspectRatio, addAuthor } from "^redux/state/articles";
import { ActionPayloadNoId, ActionWithArg } from "^types/utilities";

// type Args = ActionPayloadNoId<typeof updateBodyImageAspectRatio>

type Actions = {
  updateBodyImageAspectRatio: typeof updateBodyImageAspectRatio;
  addAuthor: typeof addAuthor;
};

type Payload = Parameters<typeof updateBodyImageAspectRatio>[0];

type A = ReturnType<typeof updateBodyImageAspectRatio>;

const useTest = () => {
  const id = "hello";

  const dispatch = useDispatch();

  function applyId(action: Actions[keyof Actions]) {
    type Arg = Object.Omit<Parameters<typeof action>[0], "id">;

    const newFunc = (arg: Arg) => dispatch(action({ ...arg, id }));

    return newFunc;
  }

  const a = applyId(updateBodyImageAspectRatio);
};

const useTest2 = () => {
  function returnNewFunc<TArg extends { b?: string }>(
    initialFunc: (arg: TArg) => void
  ) {
    const newFunc = (arg: Omit<TArg, "b">) =>
      initialFunc({ ...arg, b: "hello" });

    return newFunc;
  }

  const a = ({ b, c }: { b: string; c: string }) => {
    console.log(b, c);
  };
  const b = returnNewFunc(a);
  b({ c }); // b should have 'c' as the only field in its argument

  return;
};
