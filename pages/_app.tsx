import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { isDesktop } from "react-device-detect";
import { Slide, ToastContainer } from "react-toastify";

import { store } from "^redux/store";
import GlobalStyles from "styles/GlobalStyles";
import Authentication from "^context/AuthenticationContext";
import HandleAuthorisation from "^components/HandleAuthorisation";

function MyApp({ Component, pageProps }: AppProps) {
  if (!isDesktop) {
    return <DeviceMessage />;
  }

  return (
    <>
      <GlobalStyles />
      <Authentication.Provider>
        <HandleAuthorisation>
          <ReduxProvider store={store}>
            <Component {...pageProps} />
          </ReduxProvider>
        </HandleAuthorisation>
      </Authentication.Provider>
      <ToastContainer
        hideProgressBar
        position="bottom-right"
        transition={Slide}
      />
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
