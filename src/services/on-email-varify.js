import { SUBSCRIPTION } from "../lib/api-endpoints.js"
import API from "../lib/axios-client.js";

const onEmailVerifyMutationFn = async (body) => {
    console.log(body);
    const isTrial = body.mode == "TRIAL";
    const response = API.post(`${isTrial ? SUBSCRIPTION.startTrial : SUBSCRIPTION.subscribe}`, {
        ...body
    });
    return response;
};

export default onEmailVerifyMutationFn;