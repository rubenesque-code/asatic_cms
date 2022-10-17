import { useWriteMutationContext } from "^context/WriteMutationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import useMutationText from "^hooks/useMutationText";

import Header_ from "^components/header/_containers/Header_";
import $MutationText_ from "^components/header/_presentation/$MutationText_";

const Header = () => {
  return <Header_ leftElements={<MutationText />} />;
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
    <$MutationText_
      mutationData={{ isError, isLoading, isSuccess }}
      mutationType={mutationType}
    />
  );
};
