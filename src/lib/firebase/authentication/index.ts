import { httpsCallable } from "firebase/functions";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailLink,
  signOut as signOutUnpopulated,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { functions, auth } from "../init";

import { DOMAIN, __DEV_MODE__ } from "^constants/general";
import { ROUTES } from "^constants/routes";
import { SignInPersistence } from "^types/authentication";

type CheckIsAdminRes = {
  data: {
    isAdmin: boolean;
  };
};

export const checkIsAdmin = async (email: string) => {
  if (__DEV_MODE__) {
    const dummyAdmins = ["admin@email.com"];
    const isAdmin = dummyAdmins.includes(email);
    return isAdmin;
  } else {
    const checkIsAdminByEmail = httpsCallable(
      functions,
      "computeIsAdminByEmail"
    );
    const isAdminRes = (await checkIsAdminByEmail(email)) as CheckIsAdminRes;
    const isAdmin = isAdminRes.data.isAdmin;
    return isAdmin;
  }
};

export const sendSignInLink = async (email: string) => {
  const actionCodeSettings = {
    url: `${DOMAIN}/${ROUTES.EMAIL_SIGNIN_REDIRECT}`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const isValidEmailLink = (route: string) =>
  isSignInWithEmailLink(auth, route);

export const setSignInPersistence = async (persistence: SignInPersistence) => {
  const authPersistence =
    persistence === "local"
      ? browserLocalPersistence
      : browserSessionPersistence;
  await setPersistence(auth, authPersistence);
};

export const signInWithEmail = async ({
  email,
  route,
}: {
  email: string;
  route: string;
}) => {
  try {
    await signInWithEmailLink(auth, email, route);
    return true;
  } catch (_error) {
    return false;
  }
};

export const signOut = () => signOutUnpopulated(auth);

export const computeUserIsAdmin = async (user: User) =>
  (await user.getIdTokenResult()).claims.admin;

export const initAuthStateListener = ({
  onAuthenticated,
  onInit,
  onUnauthenticated,
}: {
  onAuthenticated: () => void;
  onInit: () => void;
  onUnauthenticated: () => void;
}) =>
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      onUnauthenticated();
      signOut();
    } else {
      const isAdmin = __DEV_MODE__ ? true : await computeUserIsAdmin(user);

      if (isAdmin) {
        onAuthenticated();
      } else {
        onUnauthenticated();
        signOut();
      }
    }

    onInit();
  });

export const addAdmin = async (email: string) => {
  const cloudFunc = httpsCallable(functions, "addAdminRole");
  await cloudFunc(email);
};
