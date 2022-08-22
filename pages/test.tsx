import { useDispatch } from "^redux/hooks";
/* import {
  addOne as addOneCreator,
  updateImageId,
} from "^redux/state/collections"; */
import { addOne, togglePublishStatus } from "^redux/state/recordedEvents";

const Test = () => {
  const dispatch = useDispatch();

  // const addOne = () => dispatch(addOneCreator());
  // const test2 = () => dispatch(updateImageId({ id: "TbMx3Hg_5pYBnxHM1WjKa" }));
  const test1 = () => dispatch(addOne());
  const test2 = () =>
    dispatch(togglePublishStatus({ id: "xUU_QsTleqtWAnt5fZZjG" }));

  return (
    <div>
      <button onClick={test1}>ADD ONE</button>
      <button onClick={test2}>TEST</button>
    </div>
  );
};

export default Test;
