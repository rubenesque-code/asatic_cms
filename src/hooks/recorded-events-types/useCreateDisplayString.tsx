import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypeById } from "^redux/state/recordedEventsTypes";

const useCreateRecordedEventTypeDisplayString = ({
  activeLanguageId,
  typeId,
}: {
  typeId: string;
  activeLanguageId: string;
}) => {
  const type = useSelector((state) =>
    selectRecordedEventTypeById(state, typeId)
  );
  const typeTranslationName = type?.translations.find(
    (t) => t.languageId === activeLanguageId
  )?.name;
  const typeStr = !type
    ? "[not found]"
    : !typeTranslationName?.length
    ? "[translation missing]"
    : typeTranslationName;

  return typeStr;
};

export default useCreateRecordedEventTypeDisplayString;
