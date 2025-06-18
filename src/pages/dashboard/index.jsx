import DashboardLayout, {
  DashboardContext,
} from "../../components/dashboard-layout";
import ChatBoard from "../../components/chat-board.jsx";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router.js";
import useUser from "../../hooks/use-user.jsx";
// import AuthUserCAcess from "../../components/auth-user-can-access.jsx";
const Dashboard = () => {
  const context = useContext(DashboardContext);
  const query = useUser();
  console.log(query);
  const router = useRouter();
  useEffect(() => {
    if (query.isFetching == false && query.isFetched && !query.isSuccess) {
      router.push("/login");
    }
  }, [query, router]);
  return <ChatBoard {...context} />;
};
Dashboard.getLayout = function (children) {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Dashboard;
