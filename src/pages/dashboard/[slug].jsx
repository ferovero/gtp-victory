import DashboardLayout, {
  useChatDashboardContext,
} from "../../components/dashboard-layout";
import ChatBoard from "../../components/chat-board";
import useUser from "../../hooks/use-user";

function DashboardSlugPage() {
  const { data: me } = useUser();
  if (me?.user && !me?.user?.isAdmin) {
    const chatDashboardContext = useChatDashboardContext();
    return <ChatBoard {...chatDashboardContext} />;
  } else {
    return <></>;
  }
}

DashboardSlugPage.getLayout = function (children) {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardSlugPage;
