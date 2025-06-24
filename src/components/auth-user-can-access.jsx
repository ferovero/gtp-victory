import { useEffect } from "react";
import useUser from "../hooks/use-user";
import { useRouter } from "next/router";
import { useGlobalContext } from "./global-context";
const AuthUserCAcess = (Component) => {
  const FetchComponent = (props) => {
    const {
      meQuery: query,
    } = useGlobalContext();
    const router = useRouter();
    useEffect(() => {
      if (query.isFetching == false && query.isFetched && !query.isSuccess) {
        router.push("/auth/login");
      }
    }, [query, router]);
    return <Component {...props} query={query} />;
  };
  return FetchComponent;
};
export default AuthUserCAcess;
