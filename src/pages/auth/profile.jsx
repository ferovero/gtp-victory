// app/auth/profile/page.jsx
import { useMutation } from "@tanstack/react-query";
import { differenceInDays, fromUnixTime } from "date-fns";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getBillingPortalMutationFn,
  logoutMutationFn,
} from "../../services/user-api";
import styles from "../../styles/profile.module.css";
import AuthUserCAcess from "../../components/auth-user-can-access";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { queryClient } from "../../components/query-provider";
function ProfilePage({ query: { data: me } }) {
  const [plan, setPlan] = useState({
    status: "subscribed",
    daysLeft: 0,
    planName: "NULL",
  });
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { mutate: getBillingPortal, isLoading: isPending } = useMutation({
    mutationFn: getBillingPortalMutationFn,
    onSuccess: (res) => {
      console.log(res);
      window.open(res.url, "_blank");
    },
  });
  const { mutate: logoutMutate, isLoading: isLoggingOut } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      Cookies.remove("gptvct_authnz");
      Cookies.remove("gptvct_admin");
      queryClient.invalidateQueries();
      if (router) {
        router.push("/");
      }
    },
    onError: (err) => {
      setError(err?.message || err?.errorMessage || "Something went wrong.");
    },
  });
  useEffect(() => {
    const user = me?.user;
    setUser(user);
    const subscription = user?.subscription;
    const isSubscribed =
      !!(subscription?.status == "active") &&
      !!subscription?.plan &&
      !!(subscription?.price > 0);
    const isTrial =
      user?.haveTrial &&
      user?.trialDays > 0 &&
      user?.trialEnd * 1000 > Date.now();
    const periodEndUnix = subscription?.periodEnd; // example timestamp
    const periodEndDate = periodEndUnix && fromUnixTime(periodEndUnix); // converts to Date
    const today = new Date();
    const daysLeft = periodEndDate && differenceInDays(periodEndDate, today);
    setPlan({
      status: isSubscribed ? "subscribed" : isTrial ? "trial" : "",
      daysLeft: daysLeft,
      planName: isSubscribed && subscription.plan,
    });
  }, [me]);
  const renderPlanDetails = () => {
    if (plan.status === "trial") {
      return (
        <>
          <p className={styles.trial}>
            You are on a <strong>trial</strong> plan. {plan.daysLeft} days left.
          </p>
          <div className={styles.actions}>
            {/* <button className={styles.cancelBtn}>Cancel Plan</button>
                        <button className={styles.upgradeBtn}>Upgrade</button> */}
            <button
              className={styles.linkBtn}
              onClick={getBillingPortal}
              disabled={isPending}
            >
              {" "}
              Manage in Stripe Billing
              {isPending ? <Loader className="spin_loader" /> : ""}
            </button>
          </div>
        </>
      );
    } else if (plan.status === "subscribed") {
      return (
        <div>
          <p className={styles.subscribed}>
            Subscribed to <strong>{plan.planName}</strong>
          </p>
        </div>
      );
    } else {
      return (
        <p className={styles.free}>No active plan. You are on a free tier.</p>
      );
    }
  };
  return (
    <div className={styles.profilePage}>
      <h1>Profile</h1>
      <button onClick={() => router.back()} className={styles.linkBtn}>
        Back to Chat
      </button>
      <section className={styles.profileSection}>
        <h2>User Info</h2>
        {/* <p><strong>Name:</strong> {user?.name}</p> */}
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </section>
      {!user?.isAdmin && (
        <section className={styles.subscriptionSection}>
          <h2>Subscription Details</h2>
          {renderPlanDetails()}
          <div className={styles.actions}>
            {/* <button className={styles.cancelBtn}>Cancel Plan</button>
                        <button className={styles.upgradeBtn}>Upgrade</button> */}
            <button
              className={styles.linkBtn}
              onClick={getBillingPortal}
              disabled={isPending}
            >
              {" "}
              Manage in Stripe Billing
              {isPending ? <Loader className="spin_loader" /> : ""}
            </button>
          </div>
        </section>
      )}
      <section className={styles.securitySection}>
        <h2>Security</h2>
        <div className={styles.actions}>
          <Link className={styles.linkBtn} href="/update-password">
            Update Password
          </Link>
          <Link className={styles.linkBtn} href="/reset-token-sender">
            Forget Password
          </Link>
          <button
            onClick={logoutMutate}
            className={styles.linkBtn}
            disabled={isLoggingOut}
          >
            Logout {isLoggingOut && <Loader className="spin_loader" />}
          </button>
        </div>
      </section>
    </div>
  );
}

export default AuthUserCAcess(ProfilePage);
