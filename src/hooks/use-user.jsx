import { useQuery } from "@tanstack/react-query";
import { getMeQueryFn, logoutMutationFn } from "../services/user-api";
import { useEffect } from "react";
import useInvalidateQuery from "./use-invalidate-query";
const useUser = () => {
  const key = ["user"];
  const query = useQuery({
    queryFn: getMeQueryFn,
    queryKey: ["user"],
    staleTime: Infinity,
  });
  const { invalidate } = useInvalidateQuery(key);
  return { ...query, invalidate };
};

export default useUser;
