import { useRouter } from "next/router.js";
import { useEffect, useState } from "react";
import ChatBoard from "../../components/chat-board.jsx";
import DashboardLayout, {
  useChatDashboardContext,
} from "../../components/dashboard-layout";
import useUser from "../../hooks/use-user.jsx";
import css from "../../styles/admin_dashboard.module.css";
// import AuthUserCAcess from "../../components/auth-user-can-access.jsx";
const Dashboard = () => {
  const { isFetching, isFetched, isSuccess, data: me } = useUser();
  //   const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (isFetching == false && isFetched && !isSuccess) {
      router.push("/login");
    }
  }, [isFetching, isFetched, isSuccess, router]);
  if (me?.user && me?.user?.isAdmin) {
    return (
      <div className={css.admin_container}>
        <div>
          <h1>Admin</h1>
        </div>
      </div>
    );
  }
  if (me?.user && !me?.user?.isAdmin) {
    const chatDashboardContext = useChatDashboardContext();
    console.log(chatDashboardContext);
    return <ChatBoard {...chatDashboardContext} />;
  }
  return <></>;
};
Dashboard.getLayout = function (children) {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Dashboard;
