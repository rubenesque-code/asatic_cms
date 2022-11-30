import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";
import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypeByLanguageAndQuery } from "^redux/state/complex-selectors/recorded-event-type";
import RecordedEventType from "./author";
import { $EntitiesList_ } from "^catalog-pages/_presentation/$EntitiesList";

const RecordedEventTypesList = () => {
  const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectRecordedEventTypeByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <$EntitiesList_ entityName="recordedEventType" isFilter={isFilter}>
      {filtered.map((recordedEventType) => (
        <RecordedEventType
          recordedEventType={recordedEventType}
          key={recordedEventType.id}
        />
      ))}
    </$EntitiesList_>
  );
};

export default RecordedEventTypesList;
