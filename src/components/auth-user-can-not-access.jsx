import { useEffect } from "react";
import useUser from "../hooks/use-user";
import { useRouter } from "next/router";
const AuthUserCNAcess = (Component) => {
  const FetchComponent = (props) => {
    const query = useUser();
    const router = useRouter();
    useEffect(() => {
        console.log(query.data?.user?.id)
        if (
          query.isFetching == false &&
          query.isFetched &&
          query.isSuccess &&
          query.data?.user?.id
        ) {
          router.push("/dashboard");
        }
    }, [query, router]);
    return <Component {...props} query={{ isLoading: query.isLoading }} />;
  };
  return FetchComponent;
};
export default AuthUserCNAcess;
