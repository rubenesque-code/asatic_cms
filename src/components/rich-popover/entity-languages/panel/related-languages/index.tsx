import { useEntityLanguageContext } from "^context/EntityLanguages";

import { $Container } from "^components/rich-popover/_styles/relatedEntities";
import Language from "./language";

const RelatedEntities = () => {
  const { languagesIds } = useEntityLanguageContext();

  return (
    <$Container>
      {languagesIds.map((languageId) => (
        <Language id={languageId} key={languageId} />
      ))}
    </$Container>
  );
};

export default RelatedEntities;
