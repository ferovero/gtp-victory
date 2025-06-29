const SUBSCRIPTION = {
    subscribe: "/subscribe",
    startTrial: "/subscription/start-trial"
};
const USER = {
    getAuthToken: "/user/authtoken",
    createPassword: "/auth/create-password",
    updatePassword: "/auth/update-password",
    login: "/auth/login",
    me: "/auth/me",
    resetPassword: "auth/reset-password",
    resetTokenSender: "/auth/send-reset-password-code",
    getAll: "/user/all"
}
export { SUBSCRIPTION, USER };