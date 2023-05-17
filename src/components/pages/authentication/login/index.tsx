import { useState } from "react";
import { CheckCircle } from "phosphor-react";
import tw from "twin.macro";

import {
  useLazyCheckIsAdminQuery,
  useLazySendSignInLinkQuery,
} from "^redux/services/authentication";

import { AUTH_PERSISTENCE_KEY, EMAIL_SIGNIN_KEY } from "^constants/general";

import { validateEmailString } from "^helpers/general";

import Spinner from "^components/Spinner";
import { SignInPersistence } from "^types/authentication";

const PageContent = () => {
  const [emailLinkSentTo, setEmailLinkSentTo] = useState<string | null>(null);

  return (
    <>
      <div css={[tw`min-h-screen grid place-items-center`]}>
        <div css={[tw`relative`]}>
          <h1 css={[tw`text-center text-xl`]}>ASATIC Site Editor</h1>
          <div css={[tw`mt-xl border border-gray-300 rounded-md  px-9 py-12`]}>
            <h2 css={[tw`font-serif-eng text-2xl`]}>Sign in</h2>
            <p css={[tw`mt-lg text-gray-600`]}>
              Enter a valid email to receive a login link.
            </p>
            <Form setEmailLinkSentTo={setEmailLinkSentTo} />
          </div>
        </div>
      </div>
      {emailLinkSentTo ? (
        <EmailSentNotification email={emailLinkSentTo} />
      ) : null}
    </>
  );
};

export default PageContent;

const Form = ({
  setEmailLinkSentTo,
}: {
  setEmailLinkSentTo: (email: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [showEmailError, setShowEmailError] = useState(false);

  const [checkIsAdmin, { isFetching: isFetchingIsAdmin }] =
    useLazyCheckIsAdminQuery();
  const [sendSignInLink] = useLazySendSignInLinkQuery();

  const submitForm = async () => {
    const inputIsEmail = validateEmailString(inputValue);

    if (!inputIsEmail) {
      setShowEmailError(true);
      return;
    }

    const emailIsAdmin = (await checkIsAdmin(inputValue)).data;

    if (!emailIsAdmin) {
      setShowEmailError(true);
      return;
    }

    const authPersistence: SignInPersistence = staySignedIn
      ? "local"
      : "session";

    await sendSignInLink(inputValue);
    window.localStorage.setItem(AUTH_PERSISTENCE_KEY, authPersistence);
    window.localStorage.setItem(EMAIL_SIGNIN_KEY, inputValue);
    setEmailLinkSentTo(inputValue);

    return;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
      css={[tw`flex flex-col mt-md`]}
    >
      {isFetchingIsAdmin ? (
        <div
          css={[
            tw`absolute left-0 top-0 w-full h-full z-10 grid place-items-center bg-overlayMid rounded-md`,
          ]}
        >
          <div css={[tw`flex flex-col items-center`]}>
            <div css={[tw`flex justify-center`]}>
              <Spinner />
            </div>
            <p css={[tw`mt-sm`]}>Checking...</p>
          </div>
        </div>
      ) : null}
      <fieldset disabled={isFetchingIsAdmin}>
        <EmailInput
          onChange={(email) => {
            setInputValue(email);
            if (showEmailError) {
              setShowEmailError(false);
            }
          }}
          value={inputValue}
        />
        <StaySignedInCheckbox setValue={setStaySignedIn} value={staySignedIn} />
        {showEmailError ? <EmailErrorMessage /> : null}
      </fieldset>
    </form>
  );
};

const emailInputId = "email-inputId";

const EmailInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div>
      <label css={[tw`text-gray-400`]} htmlFor={emailInputId}>
        Email
      </label>
      <input
        css={[
          tw`pt-2 pb-1 px-sm w-full text-gray-700 border border-gray-300 rounded-md outline-none focus:outline-none`,
        ]}
        id={emailInputId}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        type="text"
      />
    </div>
  );
};

const staySignedInCheckboxId = "stay-signed-in-checkbox";

const StaySignedInCheckbox = ({
  setValue,
  value,
}: {
  value: boolean;
  setValue: (staySignedIn: boolean) => void;
}) => {
  return (
    <div css={[tw`flex gap-xs items-center justify-end mt-xs`]}>
      <label css={[tw`text-gray-500`]} htmlFor={staySignedInCheckboxId}>
        Stay signed in
      </label>
      <input
        id={staySignedInCheckboxId}
        checked={value}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setValue(isChecked);
        }}
        type="checkbox"
      />
    </div>
  );
};

const EmailErrorMessage = () => {
  return (
    <div>
      <p css={[tw`text-red-warning mt-xs`]}>Invalid email</p>
    </div>
  );
};

const EmailSentNotification = ({ email }: { email: string }) => {
  return (
    <div css={[tw`z-50 fixed inset-0 bg-overlayDark grid place-items-center`]}>
      <div css={[tw`p-lg bg-white rounded-md`]}>
        <p css={[tw`text-green-active text-3xl flex justify-center`]}>
          <CheckCircle weight="bold" />
        </p>
        <p css={[tw`mt-md`]}>
          Email sent to <span css={[tw`font-medium`]}>{email}</span>.
        </p>
        <p css={[tw`mt-md`]}>
          Check your spam folder. Please note that a sign-in link can take up to
          10 minutes to arrive.
        </p>
        <p>You can close this tab.</p>
      </div>
    </div>
  );
};
