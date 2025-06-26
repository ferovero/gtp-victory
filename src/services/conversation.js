import API from "../lib/axios-client"
export const getConversationQueryFn = (page) => async () => {
    const response = await API.get("/conversation/all" + "?page=" + page);
    console.log(response);
    return response;
}
export const createConversationMutationFn = async ({ message }) => await API.post("/conversation", { message });
export const editConversationNameMutationFn = async ({ title, conversationId }) => API.put("/conversation", { conversationId: conversationId, title });
export const deleteConversationMutationFn = async (conversationId) => API.delete(`/conversation/${conversationId}`);
// Message
export const appendMessageMutationFn = async ({ conversationId, message }) => await API.post("/conversation/bot-response", {
    conversationId: conversationId,
    message: message,
    sender: "USER"
});
export const getAllMessagesQueryFn = (conversationId) => async () => {
    const response = await API.get(`/conversation/message/${conversationId}`);
    console.log(response.conversation)
    return response.conversation;
}