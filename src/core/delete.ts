import { request } from '@playwright/test';

const DELETE = async (requestData: any) => {
    const apiContext = await request.newContext({});
    let url: string = process.env.BASE_URL + requestData.url;
    // DELETE REQUEST
    const call = await apiContext.delete(url, {
        headers: requestData.headers,
        data: requestData.data,
    });
    const response = await call.text();
    return { response: JSON.parse(response), responseStatus: call.status() };
};

export default DELETE;
