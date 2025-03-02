import { request } from '@playwright/test';

const POST = async (requestData: any) => {
    const apiContext = await request.newContext({});
    let url: string;
    url = process.env.BASE_URL + requestData.url;
    // POST REQUEST
    const call = await apiContext.post(url, {
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

export default POST;
