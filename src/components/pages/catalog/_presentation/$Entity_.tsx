import { ReactElement } from "react";
import tw from "twin.macro";

import {
  $Controls_,
  Props as ControlsProps,
} from "^catalog-pages/_presentation/$Controls_";

export const $Entity = ({
  deleteEntity,
  entityName,
  relatedDocuments,
  translations,
}: {
  translations: ReactElement;
  relatedDocuments: ReactElement;
} & ControlsProps) => (
  <div css={[tw`flex`]} className="group">
    <div>
      <$Controls_ deleteEntity={deleteEntity} entityName={entityName} />
    </div>
    <div css={[tw`mr-sm bg-green-50`]}>
      <div css={[tw`w-[3px] h-[25px] bg-green-200`]} />
    </div>
    <div css={[tw`flex-grow`]}>
      {translations}
      <div css={[tw`mt-md`]}>{relatedDocuments}</div>
    </div>
  </div>
);
