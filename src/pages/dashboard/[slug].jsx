import DashboardLayout, {
  DashboardContext,
} from "../../components/dashboard-layout";
import ChatBoard from "../../components/chat-board";
import { useContext } from "react";

function DashboardSlugPage() {
  const context = useContext(DashboardContext);
  return <ChatBoard {...context} />;
}

DashboardSlugPage.getLayout = function (children) {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardSlugPage;
