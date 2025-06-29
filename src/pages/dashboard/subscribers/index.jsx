import { useState } from "react";
import { AdminDashboardLayout } from "../../../components/dashboard-layout";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";
import useUsers from "../../../hooks/use-users";
import styles from "../../../styles/admin_dashboard.module.css";
import { Loader } from "lucide-react";
import { useGlobalContext } from "../../../components/global-context";
import clsx from "clsx";

const Subscribers = () => {
  const { subscribersQuery, page, setPage } = useGlobalContext();
  const data = subscribersQuery?.data;
  const refetchSubscribers = subscribersQuery?.refetch;
  const isLoading =
    subscribersQuery?.isLoading || subscribersQuery?.isRefetching;
  const users = data?.users;
  console.log(isLoading);
  return (
    <AdminDashboardLayout>
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Subscribers</h1>
          <button
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onClick={refetchSubscribers}
            disabled={isLoading}
          >
            {users && users?.length > 0 && isLoading && (
              <Loader className="spin_loader" />
            )}
            Refresh
          </button>
        </div>
        <div className={styles.wrapper}>
          <table className={clsx(styles.table, styles.subscribers)}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Plan</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Subscribed On</th>
                <th className={styles.th}>Next Billing</th>
                <th className={styles.th}>Customer Id</th>
                <th className={styles.th}>Invoice</th>
                <th className={styles.th}>Canceled At</th>
              </tr>
            </thead>
            {users?.length > 0 && data && (
              <tbody>
                {users?.map((user, idx) => {
                  const subscription = user?.subscription;
                  const plan = subscription?.plan;
                  const status = subscription.status;
                  return (
                    <tr key={user.id} className={styles.tr}>
                      <td className={styles.td}>{idx + 1}</td>
                      <td className={styles.td}>{user.email}</td>
                      <td className={styles.td}>{plan}</td>
                      <td className={styles.td}>{status}</td>
                      <td className={styles.td}>
                        {new Date(user.createdAt).toDateString()}
                      </td>
                      <td className={styles.td}>
                        {new Date(subscription.periodEnd).toDateString()}
                      </td>
                      <td className={styles.td}>{subscription.customerId}</td>
                      <td className={styles.td}>{subscription.invoice}</td>
                      <td className={styles.td}>
                        {subscription.cancel &&
                          new Date(subscription.canceledAt)}
                      </td>
                    </tr>
                  );
                })}
                {!users && isLoading && (
                  <div style={{ width: "100%" }}>
                    <Loader className="spin_loader" />
                  </div>
                )}
              </tbody>
            )}
          </table>
        </div>
        <Paginate setPage={setPage} page={page} totalPages={data?.totalPages} />
      </div>
    </AdminDashboardLayout>
  );
};
const Paginate = ({ setPage, page, totalPages }) => {
  return (
    <ResponsivePagination
      current={page}
      total={totalPages}
      onPageChange={(page) => setPage(page)}
    />
  );
};
export default Subscribers;
