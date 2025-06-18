import { useQueryClient } from "@tanstack/react-query";
const useInvalidateQuery = ({ key }) => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: key,
    });
  return { invalidate };
};

export default useInvalidateQuery;
