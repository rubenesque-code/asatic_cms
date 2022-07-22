import { FormEvent, ReactElement, useState } from "react";
import tw from "twin.macro";

import WithProximityPopover from "^components/WithProximityPopover";

import { checkIsYoutubeUrl, getYoutubeVideoIdFromUrl } from "^helpers/youtube";

import s_input from "^styles/input";

type OnAddVideo = (id: string) => void;

const WithAddYoutubeVideo = ({
  children,
  isDisabled = false,
  onAddVideo,
}: {
  children: ReactElement;
  isDisabled?: boolean;
  onAddVideo: OnAddVideo;
}) => {
  return (
    <WithProximityPopover
      isDisabled={isDisabled}
      panelContentElement={<Panel onAddVideo={onAddVideo} />}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithAddYoutubeVideo;

const Panel = ({ onAddVideo }: { onAddVideo: OnAddVideo }) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [wasJustSubmitted, setWasJustSubmitted] = useState(false);

  const valueIsYoutubeUrl = checkIsYoutubeUrl(inputValue);
  const showErrorMessage =
    inputValue.length && wasJustSubmitted && !valueIsYoutubeUrl;
  // const youtubeId = "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!valueIsYoutubeUrl) {
      setWasJustSubmitted(true);
      return;
    }

    const youtubeId = getYoutubeVideoIdFromUrl(inputValue);

    if (!youtubeId) {
      setIsSubmitError(true);
      setWasJustSubmitted(true);
      return;
    }

    // const embedUrl = getYoutubeEmbedUrlFromYoutubeId(youtubeId);
    onAddVideo(youtubeId);
    setInputValue("");
  };

  return (
    <div
      css={[tw`p-sm bg-white rounded-lg border-2 border-black min-w-[35ch]`]}
    >
      <h4 css={[tw`text-base font-medium mb-sm`]}>Enter youtube url</h4>
      <form onSubmit={handleSubmit}>
        <input
          css={[
            s_input.input,
            s_input.focused,
            s_input.unFocused,
            s_input.transition,
          ]}
          value={inputValue}
          onChange={(e) => {
            setIsSubmitError(false);
            setWasJustSubmitted(false);
            setInputValue(e.target.value);
          }}
          placeholder=""
          type="text"
        />
        {showErrorMessage ? (
          <p css={[tw`text-red-warning mt-xs`]}>Invalid youtube url</p>
        ) : null}
        {isSubmitError ? (
          <p css={[tw`text-red-warning mt-xs`]}>
            Error submitting. Please try again.
          </p>
        ) : null}
      </form>
    </div>
  );
};
