import { ReactElement } from "react";
import { $SummaryContainer } from ".";

export const $ArticleLikeSummaryLayout_ = ({
  menu,
  authors,
  image,
  status,
  text,
  title,
}: {
  status: ReactElement;
  image: ReactElement;
  title: ReactElement;
  authors: ReactElement;
  text: ReactElement;
  menu: (containerIsHovered: boolean) => ReactElement;
}) => {
  return (
    <$SummaryContainer>
      {(containerIsHovered) => (
        <>
          {image}
          {title}
          {authors}
          {text}
          {status}
          {menu(containerIsHovered)}
        </>
      )}
    </$SummaryContainer>
  );
};
