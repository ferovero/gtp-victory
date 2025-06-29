import { useQuery } from "@tanstack/react-query";
import { getUsersByAddedByAdmin } from "../services/user-api";
import useInvalidateQuery from "./use-invalidate-query";

const useAddedUsers = () => {
  const key = ["added_users"];
  const query = useQuery({
    queryFn: getUsersByAddedByAdmin,
    queryKey: key,
    staleTime: Infinity,
  });
  const { invalidate } = useInvalidateQuery(key);
  return { ...query, invalidate };
};

export default useAddedUsers;
