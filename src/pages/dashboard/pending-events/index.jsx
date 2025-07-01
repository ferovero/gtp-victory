import { useEffect, useState } from "react";
import { AdminDashboardLayout } from "../../../components/dashboard-layout";
import { getAllWebEvents, postWebEvent } from "../../../services/webevent";

const PendingEvents = () => {
  const [events, setEvents] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const fetchPendingEvents = async () => {
    try {
      const events = await getAllWebEvents();
      setEvents(events?.webevents);
      setIsLoading({ general: false });
    } catch (error) {
      console.error("Error fetching pending events:", error);
      setIsLoading({ general: false });
    }
  };
  // Fetch pending events from the API
  useEffect(() => {
    fetchPendingEvents();
  }, []);
  const retryAll = (failures, customerId) => {
    failures.forEach(async (event) => {
      setIsLoading((prev) => ({ ...prev, [customerId]: true }));
      try {
        await postWebEvent(event.payload);
      } catch (err) {
        console.error("Error retrying event:", err);
        setIsLoading((prev) => ({ ...prev, [customerId]: false }));
        return;
      }
      fetchPendingEvents();
      console.log(customerId);
      setIsLoading((prev) => ({ ...prev, [customerId]: false }));
    });
  };
  return (
    <AdminDashboardLayout>
      <h1 style={{ marginTop: "2rem", marginLeft: "2rem" }}>
        Pending User Subscription
      </h1>
      <div style={{ padding: "2rem" }}>
        {!isLoading?.general && (
          <>
            {Object.entries(events)?.map(([customerId, event]) => {
              return (
                <div
                  key={customerId}
                  style={{ padding: "1rem", border: "1px solid white" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3>{event.email}</h3>
                    <button
                      style={{
                        background: "transparent",
                        border: "1px solid white",
                        color: "white",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                      onClick={() => retryAll(event.failures, customerId)}
                      disabled={isLoading[customerId]}
                    >
                      {!isLoading[customerId] ? "Re Try" : "Loading..."}
                    </button>
                  </div>
                  <div>
                    {event.failures?.map((failure) => {
                      return (
                        <div
                          key={failure.id}
                          style={{
                            padding: "1rem",
                            border: "1px solid white",
                            marginBlock: "0.75rem",
                          }}
                        >
                          <b>Event Type : {failure.type}</b>
                          <br />
                          <code
                            style={{
                              padding: "1rem",
                              background: "rgba(0,0,0,1)",
                              marginTop: "1rem",
                              display: "block",
                            }}
                          >
                            {failure.error}
                          </code>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {events.length > 0 && (
              <button onClick={retryAll}>Re Try All</button>
            )}
          </>
        )}
        {isLoading && <> Loading... </>}
        {events.length == 0 && !isLoading && <div>No pending events</div>}
      </div>
    </AdminDashboardLayout>
  );
};

export default PendingEvents;
