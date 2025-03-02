import { request } from '@playwright/test';

const GET = async (requestData: any) => {
    const apiContext = await request.newContext({});
    let url: string;    
    url = process.env.BASE_URL + requestData.url;
    
    // GET REQUEST
    const call = await apiContext.get(`${url}`, {
        headers: requestData.headers,
    });
    const response = await call.text();
    return { response: JSON.parse(response), responseStatus: call.status() };
};

export default GET;
