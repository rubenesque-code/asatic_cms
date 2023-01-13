import { ReactElement } from "react";
import { $SummaryContainer } from ".";

export const $ArticleLikeSummaryLayout_ = ({
  menu,
  authors,
  date,
  image,
  status,
  text,
  title,
}: {
  image: ReactElement | null;
  title: ReactElement;
  authors: ReactElement;
  date: ReactElement;
  text: ReactElement;
  status: ReactElement;
  menu: (containerIsHovered: boolean) => ReactElement;
}) => {
  return (
    <$SummaryContainer>
      {(containerIsHovered) => (
        <>
          {image}
          {title}
          {authors}
          {date}
          {text}
          {status}
          {menu(containerIsHovered)}
        </>
      )}
    </$SummaryContainer>
  );
};
