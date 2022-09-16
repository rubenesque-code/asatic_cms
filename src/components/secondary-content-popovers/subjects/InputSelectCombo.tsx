import { useSelector } from "^redux/hooks";
import { selectSubjects } from "^redux/state/subjects";

import { fuzzySearchSubjects } from "^helpers/subjects";

import InputSelectCombo from "^components/InputSelectCombo";
import WithTooltip from "^components/WithTooltip";
import tw from "twin.macro";
import s_transition from "^styles/transition";
import { FilePlus } from "phosphor-react";
import { Subject } from "^types/subject";
import { useDocSubjectsContext } from "./Panel";

const DocSubjectsInputSelectCombo = () => {
  return (
    <InputSelectCombo>
      <>
        <InputSelectCombo.Input
          placeholder="Add a new subject..."
          onSubmit={(inputValue) => {
            console.log(inputValue);
          }}
        />
        <Select />
      </>
    </InputSelectCombo>
  );
};

export default DocSubjectsInputSelectCombo;

const Select = () => {
  const allSubjects = useSelector(selectSubjects);

  const { inputValue } = InputSelectCombo.useContext();

  const subjectsMatchingQuery = fuzzySearchSubjects(inputValue, allSubjects);

  return (
    <InputSelectCombo.Select>
      {subjectsMatchingQuery.map((subject) => (
        <SelectSubject subject={subject} key={subject.id} />
      ))}
    </InputSelectCombo.Select>
  );
};

const SelectSubject = ({ subject }: { subject: Subject }) => {
  const { addSubjectToDoc, docSubjectsIds } = useDocSubjectsContext();

  const canAddToDoc = !docSubjectsIds.includes(subject.id);

  return (
    <WithTooltip
      text="add subject to document"
      type="action"
      isDisabled={!canAddToDoc}
    >
      <button
        css={[
          tw`text-left py-1 relative w-full px-sm`,
          !canAddToDoc && tw`pointer-events-none`,
        ]}
        className="group"
        onClick={() => addSubjectToDoc(subject.id)}
        type="button"
      >
        <span
          css={[
            tw`text-gray-600 group-hover:text-gray-800`,
            !canAddToDoc && tw`text-gray-400`,
          ]}
        >
          {subject.translations
            .filter((translation) => translation.text.length)
            .map((translation, i) => (
              <div css={[tw`flex items-center gap-xs`]} key={translation.id}>
                {i > 0 ? (
                  <span css={[tw`w-[0.5px] h-[15px] bg-gray-200`]} />
                ) : null}
                <p>{translation.text}</p>
              </div>
            ))}
        </span>
        {canAddToDoc ? (
          <span
            css={[
              s_transition.onGroupHover,
              tw`group-hover:z-50 bg-white absolute right-2 top-1/2 -translate-y-1/2 text-green-600`,
            ]}
          >
            <FilePlus weight="bold" />
          </span>
        ) : null}
      </button>
    </WithTooltip>
  );
};
