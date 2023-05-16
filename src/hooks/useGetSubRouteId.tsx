import { useRouter } from "next/router";

const useGetSubRouteId = () => {
  const router = useRouter();
  const query = router.query;
  const documentId = query.id as string;

  return documentId;
};

export default useGetSubRouteId;
