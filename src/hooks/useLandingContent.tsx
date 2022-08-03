import { useSelector } from "^redux/hooks";
import { selectAll as selectLandingSections } from "^redux/state/landing";

const useSearchLandingContent = () => {
  const landingSections = useSelector(selectLandingSections);
  const customLandingSections = landingSections.flatMap((section) =>
    section.type === "custom" ? [section] : []
  );
  const usedArticlesById = customLandingSections
    .flatMap((s) => s.components)
    .filter((c) => c.type === "article")
    .map((c) => c.docId);

  return {
    articles: usedArticlesById,
  };
};

export default useSearchLandingContent;
