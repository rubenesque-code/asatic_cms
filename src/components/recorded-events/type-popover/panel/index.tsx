import tw from "twin.macro";
import Meta from "./Meta";

const Panel = () => {
  return (
    <$Container>
      <Meta />
    </$Container>
  );
};

export default Panel;

const $Container = tw.div`min-w-[800px] max-w-[94vw] p-md bg-white shadow-lg rounded-md border`;
