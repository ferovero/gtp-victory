import API from "../lib/axios-client";
export const postWebEvent = async (stripeEvent) => {
    const response = await API.post("/webevent", {
        stripeEvent: JSON.parse(stripeEvent)
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
};
export const getAllWebEvents = async () => {
    const response = await API.get("/webevent");
    return response;
};