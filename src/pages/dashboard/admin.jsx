import { useQuery } from "@tanstack/react-query";
import { getAllUsersQueryFn } from "../../services/user-api";
import { useState } from "react";
import styles from "../../styles/admin_dashboard.module.css";
const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: getAllUsersQueryFn,
    staleTime: Infinity,
  });
  console.log(users);
  if (isLoading) return <p>Loading users...</p>;
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Subscribed Users</h1>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Plan</th>
            <th className={styles.th}>Trialing</th>
            <th className={styles.th}>Subscribed On</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.id} className={styles.tr}>
              <td className={styles.td}>{idx + 1}</td>
              <td className={styles.td}>{user.name}</td>
              <td className={styles.td}>{user.email}</td>
              <td className={styles.td}>{user.subscription.plan || "Free"}</td>
              <td className={styles.td}>
                {user.haveTrial ? "Yes" : "No"}{" "}
              </td>
              <td className={styles.td}>
                {user.subscription.periodStart &&
                  new Date(
                    user.subscription.periodStart * 1000
                  ).toLocaleDateString()}{" "}
                -{" "}
                {user.subscription.periodEnd &&
                  new Date(
                    user.subscription.periodEnd * 1000
                  ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserProfile = () => {
  return <div></div>;
};
export default AdminDashboard;
