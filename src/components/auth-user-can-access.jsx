import { useEffect } from "react";
import useUser from "../hooks/use-user";
import { useRouter } from "next/router";
import { useGlobalContext } from "./global-context";
import Cookies from "js-cookie";
const AuthUserCAcess = (Component) => {
  const FetchComponent = (props) => {
    const { meQuery: query } = useGlobalContext();
    const router = useRouter();
    useEffect(() => {
      if (
        (query.isFetching == false && query.isFetched && !query.isSuccess) ||
        !Cookies.get("gptvct_authnz")
      ) {
        router.push("/auth/login");
      }
    }, [query, router]);
    return <Component {...props} query={query} />;
  };
  return FetchComponent;
};
export default AuthUserCAcess;
