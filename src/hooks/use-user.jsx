import { useQuery } from "@tanstack/react-query";
import { getMeQueryFn } from "../services/user-api";
import useInvalidateQuery from "./use-invalidate-query";
import Cookies from "js-cookie";
const useUser = () => {
  const cookies = Cookies;
  const key = ["user"];
  const query = useQuery({
    queryFn: getMeQueryFn,
    queryKey: ["user"],
    staleTime: Infinity,
  });
  const { invalidate } = useInvalidateQuery(key);
  if (!query.isFetching && query.data?.user?.id) {
    cookies.set("gptvct_authnz", true);
    if (query?.data?.user?.isAdmin) {
      cookies.set("gptvct_admin", true);
    } else {
      cookies.remove("gptvct_admin");
    }
  } else if (!query.isFetching && !query.data?.user?.id) {
    cookies.remove("gptvct_authnz");
    cookies.remove("gptvct_admin");
  }
  return { ...query, invalidate };
};

export default useUser;
