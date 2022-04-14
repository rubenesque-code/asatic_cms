const Overlay = ({ show }: { show: boolean }) => {
  return (
    <div
      className={`fixed transition-opacity z-40 ease-in-out duration-75 top-0 left-0 w-full h-screen bg-overlayLight ${
        show ? "opacity-100" : "opacity-0 hidden"
      }`}
    ></div>
  );
};

export default Overlay;
