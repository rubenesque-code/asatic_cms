import { useDispatch } from "^redux/hooks";
import { testPrepare } from "^redux/state/test";

const Test = () => {
  const dispatch = useDispatch();

  const a = () => dispatch(testPrepare("hello"));

  return (
    <div>
      <button onClick={a}>ADD ONE</button>
      {/* <button onClick={test2}>TEST</button> */}
    </div>
  );
};

export default Test;
