import { z } from "zod";
import { USER } from "../lib/api-endpoints";
import API from "../lib/axios-client";
import Cookies from "js-cookie";
import { queryClient } from "../components/query-provider";
export const getBillingPortalMutationFn = async () => API.get('/manage-billing');
export const getAuthTokenMutationFn = async (token) => {
    const response = await API.get(`${USER.getAuthToken}/${token}`);
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
    return response;
}
export const logoutMutationFn = async (router = null) => {
    const response = await API.get("/auth/logout");
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
    const response = await API.post(`${USER.resetPassword}`, bodyPayload, {
        headers: {
            "x-csrf-token": bodyPayload.csrfToken
        }
    });
    return response;
}
export const getMeQueryFn = async () => {
    const response = await API.get(USER.me);
    return response;
}
export const getAllUsersQueryFn = (page) => async () => {
    const response = await API.get(`${USER.getAll}?page=${page}`);
    return response;
}
export const getUsersByAddedByAdmin = async () => {
    const response = await API.get("/user/get-users-added-by-admin");
    return response.users;
}
export const createUserMutationFn = async (body) => {
    const response = await API.post("/user/create-user-by-admin", {
        ...body
    });
    return response;
};
export const deleteUserByAdminMutationFn = async (userId) => {
    const response = await API.delete("/user/admin-added/" + userId);
    return response;
}
export const searchUserMutationFn = async (searchStr) => {
    const response = await API.get('/user/all?search=' + searchStr);
    return response;
}