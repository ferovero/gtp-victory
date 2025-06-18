"use client";
import useSearchQuery from "../hooks/use-search-query";
export default function Success() {
    const searchQuery = useSearchQuery();
    const isTrial = searchQuery?.code == "TRIAL_STARTED";
    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '2rem' }}>
            <h1>✅ {isTrial ? "Trial has been Started" : "Subscription"} Successful</h1>
            <p>Your payment was successful. You now have full access. Check your email to create your account.</p>
        </main>
    );
}
