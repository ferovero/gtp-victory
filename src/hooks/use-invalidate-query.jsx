import { queryClient } from "../components/query-provider";

const useInvalidateQuery = ({ key }) => {
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: key,
    });
  return { invalidate };
};

export default useInvalidateQuery;
