import { toast } from "react-toastify";
import { orderDisplayContent } from "^helpers/displayContent";
import { useDispatch, useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";
import { selectBlogs } from "^redux/state/blogs";
import { populateSection, removeAll } from "^redux/state/landing";

export const usePopulateLandingWithLatest = () => {
  const articles = useSelector(selectArticles);
  const blogs = useSelector(selectBlogs);

  const dispatch = useDispatch();

  const componentEntities = orderDisplayContent([...articles, ...blogs]).map(
    (entity) => ({
      id: entity.id,
      type: entity.type,
    })
  );

  const numFirstSectionComponents = 5;
  const numSecondSectionComponents = 6;

  const firstSectionEntities = componentEntities.slice(
    0,
    numFirstSectionComponents
  );
  const secondSectionEntities = componentEntities.slice(
    numFirstSectionComponents,
    componentEntities.length <
      numFirstSectionComponents + numSecondSectionComponents
      ? componentEntities.length
      : numFirstSectionComponents + numSecondSectionComponents
  );

  const populate = () => {
    dispatch(removeAll());
    dispatch(
      populateSection({
        entities: firstSectionEntities,
        section: 0,
      })
    );
    dispatch(
      populateSection({
        entities: secondSectionEntities,
        section: 1,
      })
    );
    toast.success("populated page");
  };

  return populate;
};
