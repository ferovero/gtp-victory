import { useEffect } from "react";
import useUser from "../hooks/use-user";
import { useRouter } from "next/router";
const AuthUserCAcess = (Component) => {
  const FetchComponent = (props) => {
    const query = useUser();
    const router = useRouter();
    useEffect(() => {
      if (query.isFetching == false && query.isFetched && !query.isSuccess) {
        router.push("/login");
      }
    }, [query, router]);
    return <Component {...props} query={query} />;
  };
  return FetchComponent;
};
export default AuthUserCAcess;
