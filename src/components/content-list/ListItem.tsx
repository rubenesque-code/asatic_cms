import { ReactElement } from "react";
import tw from "twin.macro";

const ListItem = ({
  index,
  content,
}: {
  index: number;
  content: ReactElement;
}) => {
  const number = index + 1;

  return <ListItemUI number={number} content={content} />;
};

export default ListItem;

const ListItemUI = ({
  number,
  content,
}: {
  number: number;
  content: ReactElement;
}) => (
  <div css={[tw`relative flex`]}>
    <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
    {content}
  </div>
);
