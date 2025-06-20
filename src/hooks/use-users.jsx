import { useQuery } from "@tanstack/react-query";
import { getAllUsersQueryFn } from "../services/user-api";
const useUsers = (page) => {
  const query = useQuery({
    queryFn: getAllUsersQueryFn(page),
    queryKey: ["users", page],
    staleTime: Infinity,
  });
  return query;
};
export default useUsers;
