import { useWriteMutationContext } from "^context/WriteMutationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import useMutationText from "^hooks/useMutationText";

import HeaderGeneric from "^components/header/Header";
import MutationTextUI from "^components/display-entities-page/MutationTextUI";

const Header = () => {
  return <HeaderGeneric leftElements={<MutationText />} />;
};

export default Header;

const MutationText = () => {
  const [, createMutationData] = useWriteMutationContext();
  const [, deleteMutationData] = useDeleteMutationContext();

  const { isError, isLoading, isSuccess, mutationType } = useMutationText({
    createMutationData,
    deleteMutationData,
  });

  return (
    <MutationTextUI
      mutationData={{ isError, isLoading, isSuccess }}
      mutationType={mutationType}
    />
  );
};
