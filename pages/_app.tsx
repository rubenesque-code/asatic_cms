import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { isDesktop } from "react-device-detect";
import { Slide, ToastContainer } from "react-toastify";

import { store } from "^redux/store";
import GlobalStyles from "styles/GlobalStyles";

function MyApp({ Component, pageProps }: AppProps) {
  if (!isDesktop) {
    return <DeviceMessage />;
  }

  return (
    <>
      <GlobalStyles />
      <ReduxProvider store={store}>
        <Component {...pageProps} />
        <ToastContainer
          hideProgressBar
          position="bottom-right"
          transition={Slide}
        />
      </ReduxProvider>
    </>
  );
}

export default MyApp;

const DeviceMessage = () => (
  <div className="grid h-screen w-full place-items-center">
    <p>
      This site doesn&apos;t work from this type of device. <br />
      Please use a laptop or desktop.
    </p>
  </div>
);
