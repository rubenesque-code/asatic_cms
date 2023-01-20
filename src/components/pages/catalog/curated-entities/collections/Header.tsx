// import { useWriteMutationContext } from "^context/WriteMutationContext";
// import { useDeleteMutationContext } from "./DeleteMutationContext";

// import useMutationText from "^hooks/useMutationText";

import { Header_ } from "^components/header";
// import { Header_, $MutationText_ } from "^components/header";

const Header = () => {
  return <Header_ />;
};

export default Header;

/* const MutationText = () => {
  // const [, createMutationData] = useWriteMutationContext();
  const [, deleteMutationData] = useDeleteMutationContext();

  const { isError, isLoading, isSuccess, mutationType } = useMutationText({
    deleteMutationData,
  });

  return (
    <$MutationText_
      mutationData={{ isError, isLoading, isSuccess }}
      mutationType={mutationType}
    />
  );
};
 */
