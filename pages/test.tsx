import { useDispatch } from "^redux/hooks";
import { addOne } from "^redux/state/collections";

const Test = () => {
  const dispatch = useDispatch();

  const addCollection = () => dispatch(addOne());
  // const test2 = () => dispatch(updateImageId({ id: "TbMx3Hg_5pYBnxHM1WjKa" }));
  // const test1 = () => dispatch(addOne());
  // const test2 = () =>
  // dispatch(togglePublishStatus({ id: "xUU_QsTleqtWAnt5fZZjG" }));

  return (
    <div>
      <button onClick={addCollection}>ADD ONE</button>
      {/* <button onClick={test2}>TEST</button> */}
    </div>
  );
};

export default Test;
