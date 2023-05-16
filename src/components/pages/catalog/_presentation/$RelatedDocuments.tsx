import tw from "twin.macro";

import {
  RelatedDocument_,
  Props as RelatedDocumentsProps,
} from "../_containers";

export const $RelatedDocuments_ = ({
  relatedDocuments,
}: {
  relatedDocuments: RelatedDocumentsProps[];
}) => {
  return !relatedDocuments.length ? (
    <div css={[tw`text-gray-500 italic text-sm ml-xs mt-xs`]}>None</div>
  ) : (
    <div css={[tw`mt-xs flex flex-col gap-xs`]}>
      {relatedDocuments.map((doc) => (
        <RelatedDocument_
          entity={doc.entity}
          translations={doc.translations.map((t) => ({
            languageId: t.languageId,
            title: t.title,
          }))}
          key={doc.entity.id}
        />
      ))}
    </div>
  );
};
