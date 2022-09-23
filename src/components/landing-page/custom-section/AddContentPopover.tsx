import { ReactElement } from "react";

import LandingCustomSectionContext from "^context/landing/LandingCustomSectionContext";

import PrimaryContentPopover from "^components/add-primary-content-popover";

function AddContentPopover({ children }: { children: ReactElement }) {
  const [, { addComponentToCustom }] = LandingCustomSectionContext.useContext();

  return (
    <PrimaryContentPopover
      addContentToDoc={({ docId, docType }) => {
        addComponentToCustom({ docId, type: docType });
      }}
      docType="landing section"
    >
      {children}
    </PrimaryContentPopover>
  );
}

export default AddContentPopover;

AddContentPopover.Button = PrimaryContentPopover.Button;
