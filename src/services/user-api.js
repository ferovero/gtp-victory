import { z } from "zod";
import { USER } from "../lib/api-endpoints";
import API from "../lib/axios-client"
export const getBillingPortalMutationFn = async () => API.get('/manage-billing');
export const getAuthTokenMutationFn = async (token) => {
    // console.log(token);
    const response = await API.get(`${USER.getAuthToken}/${token}`);
    // console.log(response);
    return response.authToken;
};
export const createPasswordMutationFn = async (body) => {
    const bodyPayload = z.object({ token: z.string(), password: z.string().min(8) }).parse(body);
    const response = await API.post(`${USER.createPassword}`, bodyPayload);
    return response;
}
export const updatePasswordMutationFn = async (body) => {
    const response = await API.post(`${USER.updatePassword}`, body);
    return response;
}
export const loginMutationFn = async (body) => {
    const response = await API.post(`${USER.login}`, body);
    console.log("Response :: ", response);
    return response;
}
export const logoutMutationFn = async (router = null) => {
    const response = await API.get("/auth/logout");
    if (router) {
        router.push("/");
    }
    return response;
}
export const resetTokenSenderMutationFn = async (body) => {
    const response = await API.post(`${USER.resetTokenSender}`, body, {
        headers: {
            "x-csrf-token": body.csrfToken
        }
    });
    return response;
}
export const resetPasswordMutationFn = async (body) => {
    const bodyPayload = z.object({ csrfToken: z.string().min(10), resetCode: z.string(), password: z.string().min(8) }).parse(body);
    console.log(bodyPayload);
    const response = await API.post(`${USER.resetPassword}`, bodyPayload, {
        headers: {
            "x-csrf-token": bodyPayload.csrfToken
        }
    });
    return response;
}
export const getMeQueryFn = async () => {
    const response = await API.get(USER.me);
    console.log(response);
    return response;
}

export const getAllUsersQueryFn = async () => {
    const response = await API.get(USER.getAll);
    console.log(response);
    return response.users;
}