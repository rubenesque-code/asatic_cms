import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import tw from "twin.macro";

import Spinner from "^components/Spinner";

import { AUTH_PERSISTENCE_KEY, EMAIL_SIGNIN_KEY } from "^constants/general";

import { ROUTES } from "^constants/routes";

import {
  isValidEmailLink,
  setSignInPersistence,
  signInWithEmail,
} from "^lib/firebase/authentication";
import { SignInPersistence } from "^types/authentication";

// * in development, app is in react strict mode which causes a re-render of useEffect; handleSignIn to run twice and too many toasts.

const PageContent = () => {
  const [status, setStatus] = useState<"uninitialised" | "pending">(
    "uninitialised"
  );

  const router = useRouter();

  useEffect(() => {
    if (status !== "uninitialised") {
      return;
    }

    setStatus("pending");

    const handleSignInError = () => {
      toast.error("Something went wrong with the sign-in.");
      router.push(ROUTES.SIGNIN);
    };

    const route = window.location.href;
    const isValidRoute = isValidEmailLink(route);

    if (!isValidRoute) {
      handleSignInError();
      return;
    }

    let email = window.localStorage.getItem(EMAIL_SIGNIN_KEY);
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }

    if (!email) {
      handleSignInError();
      return;
    }

    const handleSignIn = async (email: string, route: string) => {
      const signInPersistenceFromLocalStorage = window.localStorage.getItem(
        AUTH_PERSISTENCE_KEY
      ) as SignInPersistence | null;
      const signInPersistence: SignInPersistence =
        signInPersistenceFromLocalStorage || "session";
      await setSignInPersistence(signInPersistence);

      const isSignInSuccess = await signInWithEmail({ email, route });

      if (isSignInSuccess) {
        window.localStorage.removeItem(AUTH_PERSISTENCE_KEY);
        window.localStorage.removeItem(EMAIL_SIGNIN_KEY);
      } else {
        handleSignInError();
      }
    };
    handleSignIn(email, route);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div css={[tw`h-screen grid place-items-center`]}>
      <div css={[tw`flex flex-col items-center gap-sm`]}>
        <Spinner />
        <p>Checking sign in...</p>
      </div>
    </div>
  );
};

export default PageContent;
