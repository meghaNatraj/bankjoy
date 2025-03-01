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
    return { response: JSON.parse(response), responseStatus: call.status() };
};

export default PATCH;
