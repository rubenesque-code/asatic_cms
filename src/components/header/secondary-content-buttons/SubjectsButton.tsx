import { Books } from "phosphor-react";
import tw from "twin.macro";

import { MyOmit } from "^types/utilities";

import MissingTranslation from "^components/MissingTranslation";
import DocSubjectsPopover, {
  ButtonWrapperProps,
} from "^components/secondary-content-popovers/subjects";
import Header from "../Header";

type Props = MyOmit<ButtonWrapperProps, "children">;

const SubjectsButton = (props: Props) => {
  return (
    <DocSubjectsPopover.Button {...props}>
      {({ subjectsStatus }) => (
        <div css={[tw`relative`]}>
          <Header.IconButton tooltip="subjects">
            <Books />
          </Header.IconButton>
          {subjectsStatus.includes("missing translation") ? (
            <div
              css={[
                tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90`,
              ]}
            >
              <MissingTranslation tooltipText="missing translation" />
            </div>
          ) : null}
        </div>
      )}
    </DocSubjectsPopover.Button>
  );
};

export default SubjectsButton;
