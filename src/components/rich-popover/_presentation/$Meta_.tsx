import {
  $NoRelatedEntityText,
  $RelatedEntityText,
} from "^components/rich-popover/_styles";

export const $RelatedEntityText_ = ({
  popoverEntity,
  relatedEntity,
}: {
  popoverEntity: { label: string };
  relatedEntity: {
    label: string;
    isOne: boolean;
  };
}) =>
  !relatedEntity.isOne ? (
    <$NoRelatedEntityText>
      This {relatedEntity.label} has no {popoverEntity.label}s related to it.
    </$NoRelatedEntityText>
  ) : (
    <$RelatedEntityText>
      This {relatedEntity.label} has the following {popoverEntity.label}s
      related to it:
    </$RelatedEntityText>
  );
