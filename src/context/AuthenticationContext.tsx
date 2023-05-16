import React, {
  createContext,
  useContext,
  ReactElement,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import tw from "twin.macro";

import { initAuthStateListener } from "^lib/firebase/authentication";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Authentication() {}

type Value = { authListenerIsInit: boolean; isAuthenticated: boolean };

const AuthenticationContext = createContext<Value | null>(null);
const { Provider } = AuthenticationContext;

Authentication.Provider = function AuthenticationProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [authListenerIsInit, setAuthListenerIsInit] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (typeof document === "undefined") {
    //* workaround for nextjs production warning
    React.useLayoutEffect = useEffect;
  }

  useLayoutEffect(() => {
    if (authListenerIsInit) {
      return;
    }

    const onAuthenticated = () => setIsAuthenticated(true);
    const onUnauthenticated = () => setIsAuthenticated(false);

    initAuthStateListener({
      onAuthenticated,
      onInit: () =>
        !authListenerIsInit &&
        setTimeout(() => {
          setAuthListenerIsInit(true);
        }, 300),
      onUnauthenticated,
    });

    // return () => unsubscribeRef()
  }, [authListenerIsInit]);

  const value: Value = { authListenerIsInit, isAuthenticated };

  if (!authListenerIsInit) {
    return (
      <div css={[tw`h-screen grid place-items-center`]}>
        <p>Authenticating...</p>
      </div>
    );
  }

  return <Provider value={value}>{children}</Provider>;
};

Authentication.useContext = function useAuthenticationContext() {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "useAuthenticationContext must be used within its provider"
    );
  }

  return context;
};
