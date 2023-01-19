import { toast } from "react-toastify";

import { useDispatch, useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";
import { selectBlogs } from "^redux/state/blogs";
import { populateSection, removeAll } from "^redux/state/landing";

import { orderDisplayContent } from "^helpers/displayContent";

import SiteLanguage from "^components/SiteLanguage";

export const usePopulateLandingWithLatest = () => {
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const articles = useSelector(selectArticles).filter((article) =>
    article.translations.find(
      (translation) => translation.languageId === siteLanguageId
    )
  );
  const blogs = useSelector(selectBlogs).filter((blog) =>
    blog.translations.find(
      (translation) => translation.languageId === siteLanguageId
    )
  );

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

  const dispatch = useDispatch();

  const populate = () => {
    dispatch(removeAll());
    dispatch(
      populateSection({
        entities: firstSectionEntities,
        section: 0,
        languageId: siteLanguageId,
      })
    );
    dispatch(
      populateSection({
        entities: secondSectionEntities,
        section: 1,
        languageId: siteLanguageId,
      })
    );
    toast.success("populated page");
  };

  return populate;
};
