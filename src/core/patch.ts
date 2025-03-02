import { request } from '@playwright/test';

const PATCH = async (requestData: any) => {
    const apiContext = await request.newContext({});
    const url = process.env.BASE_URL + requestData.url;

    // REQUEST PATCH
    const call = await apiContext.patch(url, {
        headers: requestData.headers,
        form: requestData.form,
        data: requestData.data,
    });
    const response = await call.text();
    let parsedResponse: any;
    try {
        parsedResponse = JSON.parse(response);
    } catch (e) {
        console.log("Error parsing POST response: ", e);
    }
    return { response: parsedResponse, responseStatus: call.status() };
};

export default PATCH;
