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
  console.log(query?.data);
  if (!query.isFetching && query.data?.user?.id) {
    console.log(query?.data?.user?.isAdmin);
    cookies.set("gptvct_authnz", true);
    if (query?.data?.user?.isAdmin) {
      cookies.set("gptvct_admin", true);
    }
  } else if (!query.isFetching && !query.data?.user?.id) {
    console.log(query.data?.user);
    cookies.remove("gptvct_authnz");
    cookies.remove("gptvct_admin");
  }
  return { ...query, invalidate };
};

export default useUser;
