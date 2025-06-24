import DashboardLayout, {
  useChatDashboardContext,
} from "../../components/dashboard-layout";
import ChatBoard from "../../components/chat-board";

function DashboardSlugPage() {
  const chatDashboardContext = useChatDashboardContext();
  return <ChatBoard {...chatDashboardContext} />;
}

DashboardSlugPage.getLayout = function (children) {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardSlugPage;
