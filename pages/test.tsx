import tw from "twin.macro";
import Popover from "^components/ProximityPopover";

const Test = () => {
  return (
    <div css={[tw`h-screen`]}>
      <button>ADD ONE</button>
      <Popover>
        {({ isOpen }) => (
          <>
            <Popover.Button>
              <span>Hello</span>
            </Popover.Button>
            <Popover.Panel isOpen={isOpen}>
              <div>I am a panel. HELOL!</div>
            </Popover.Panel>
          </>
        )}
      </Popover>
      {/* <button onClick={test2}>TEST</button> */}
    </div>
  );
};

export default Test;
