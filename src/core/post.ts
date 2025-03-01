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
    return { response: JSON.parse(response), responseStatus: call.status() };
};

export default POST;
