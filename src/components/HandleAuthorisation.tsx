import React, { ReactElement, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";

import { ROUTES } from "^constants/routes";

import Authentication from "^context/AuthenticationContext";
import tw from "twin.macro";
import { toast } from "react-toastify";

// * if sign-in page, want to redirect if already signed in
// * will need to wait until authListener is init before can determine authentication

// * an issue may be that we are re-routing before authListener has necessarily updated

const HandleAuthorisation = ({ children }: { children: ReactElement }) => {
  if (typeof document === "undefined") {
    //* workaround for nextjs production warning
    React.useLayoutEffect = useEffect;
  }

  const { isAuthenticated } = Authentication.useContext();

  const router = useRouter();
  const pathName = router.pathname;
  const routeName = pathName.substring(1, pathName.length);
  const isSignInPage =
    routeName === ROUTES.SIGNIN ||
    routeName === ROUTES.EMAIL_SIGNIN_AUTHORISATION;

  const isSignInPageAndAuthenticated = isSignInPage && isAuthenticated;
  const isNonSignInPageAndNotAuthenticated = !isSignInPage && !isAuthenticated;

  useLayoutEffect(() => {
    if (isSignInPageAndAuthenticated) {
      toast.success("Signed in successfully.");
      router.push("/");
      return;
    }
    if (isNonSignInPageAndNotAuthenticated) {
      toast.error("Can't access that page. Not signed in.");
      router.push(ROUTES.SIGNIN);
      return;
    }
  }, [
    isSignInPageAndAuthenticated,
    router,
    isNonSignInPageAndNotAuthenticated,
  ]);

  if (isSignInPageAndAuthenticated) {
    return (
      <div css={[tw`h-screen grid place-items-center`]}>
        <p>Signed in, redirecting...</p>
      </div>
    );
  }

  if (isNonSignInPageAndNotAuthenticated) {
    return (
      <div css={[tw`h-screen grid place-items-center`]}>
        <p>Not signed in, redirecting...</p>
      </div>
    );
  }

  return children;
};

export default HandleAuthorisation;
